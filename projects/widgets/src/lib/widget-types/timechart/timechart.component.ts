import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import * as dayjs from "dayjs";
import { MeasurementTypes } from "squacapi";

import { EChartsOption, TooltipComponentPositionCallbackParams } from "echarts";
import { LabelFormatterParams, WidgetTypeComponent } from "../../interfaces";
import {
  WidgetConfigService,
  WidgetConnectService,
  WidgetManagerService,
} from "../../services";
import { parseUtc } from "../../utils";
import { EChartComponent } from "../../components/e-chart/e-chart.component";
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from "ngx-echarts";

/**
 * Time series widget with channels as lines
 */
@Component({
  selector: "widget-timechart",
  templateUrl: "../../components/e-chart/e-chart.component.html",
  styleUrls: ["../../components/e-chart/e-chart.component.scss"],
  standalone: true,
  imports: [NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: (): unknown => ({
        echarts: (): unknown => import("echarts"),
      }),
    },
  ],
})
export class TimechartComponent
  extends EChartComponent
  implements OnInit, WidgetTypeComponent, OnDestroy
{
  /** max # of measurement widths before chart should disconnect */
  maxMeasurementGap = 1.5;

  /** @ignore */
  constructor(
    private widgetConfigService: WidgetConfigService,
    protected widgetConnectService: WidgetConnectService,
    override widgetManager: WidgetManagerService,
    override ngZone: NgZone
  ) {
    super(widgetManager, widgetConnectService, ngZone);
  }

  /**
   * Sets up initial chart configuration
   */
  configureChart(): void {
    const dataZoom = this.denseView
      ? this.denseOptions.dataZoom
      : this.fullOptions.dataZoom;
    const grid = this.denseView
      ? this.denseOptions.grid
      : this.fullOptions.grid;

    const chartOptions: EChartsOption = {
      ...this.chartDefaultOptions,
      dataZoom,
      grid,
      xAxis: {
        type: "time",
        nameLocation: "middle",
        name: "Measurement Start Date",
        nameGap: 15,
        axisPointer: {
          show: true,
          triggerTooltip: false,
          label: {
            formatter: (params: LabelFormatterParams) =>
              this.widgetConfigService.timeAxisPointerLabelFormatting(params),
          },
        },
        axisLabel: {
          margin: 3,
          hideOverlap: true,
          fontSize: 11,
          formatter: (params: string) =>
            this.widgetConfigService.timeAxisTickFormatting(params),
        },
        nameTextStyle: {
          align: "center",
        },
        axisTick: {
          show: true,
        },
        axisLine: {
          show: true,
        },
      },
      yAxis: {
        type: "value",
        nameLocation: "middle",
        axisLabel: {
          fontSize: 11,
          width: 50,
          formatter: (value: number): string => {
            return value.toPrecision(4);
          },
        },
        axisLine: {
          show: true,
        },
        axisTick: {
          show: true,
        },
      },
      tooltip: {
        ...this.chartDefaultOptions.tooltip,
        formatter: (params: TooltipComponentPositionCallbackParams) => {
          return this.widgetConfigService.timeAxisFormatToolTip(params);
        },
      },
    };

    this.options = chartOptions;
  }

  /**
   * Builds chart data from measurement data
   *
   * @param data measurement data
   */
  buildChartData(data: MeasurementTypes[]): Promise<void> {
    return new Promise<void>((resolve) => {
      const stations = [];
      this.metricSeries = {};
      const series = {
        type: "line",
        large: true,
        largeThreshold: 500,
        legendHoverLink: true,
        lineStyle: {
          width: 1,
          opacity: 1,
        },
        emphasis: {
          focus: "series",
          endLabel: {
            show: true,
            offset: [-100, 0],
          },
        },

        symbol: "circle",
        symbolSize: 2,
        sampling: "lttb",
      };
      // this.addThresholds();

      const metric = this.selectedMetrics[0];
      this.channels.forEach((channel) => {
        const nslc = channel.nslc;
        const station = {
          ...series,
          ...{
            name: nslc,
            id: nslc,
            data: [],
            count: 0,
            encode: {
              x: [0, 1],
              y: 2,
              label: 3,
            },
          },
        };
        let lastEnd: dayjs.Dayjs;

        data
          .filter((m) => m.channel === channel.id && m.metric === metric.id)
          .forEach((measurement) => {
            const value =
              measurement.value ?? measurement[this.widgetManager.dataStat];

            // // If time between measurements is greater than gap, don't connect
            const start = parseUtc(measurement.starttime);
            const end = parseUtc(measurement.endtime);

            const diff = start.diff(end, "seconds");
            if (lastEnd && diff >= metric.sampleRate * this.maxMeasurementGap) {
              // time since last measurement
              station.data.push({
                name: nslc,
                value: [lastEnd.toDate(), start.toDate(), "-"],
              });
            }

            station.data.push({
              name: nslc,
              value: [start.toDate(), end.toDate(), value, nslc],
            });

            lastEnd = end;

            this.widgetConfigService.calculateDataRange(metric.id, value);
          });

        stations.push(station);
      });
      this.metricSeries.series = stations;
      this.visualMaps = this.widgetConfigService.getVisualMapFromThresholds(
        this.selectedMetrics,
        this.properties,
        2
      );
      resolve();
    });
  }

  /**
   *  Change metrics shown on the chart
   */
  changeMetrics(): void {
    const colorMetric = this.selectedMetrics[0];
    const visualMaps = this.visualMaps[colorMetric.id];
    visualMaps.show = this.showKey;
    const options = {
      series: this.metricSeries.series,
      visualMap: visualMaps,
      xAxis: {
        min: this.widgetManager.starttime,
        max: this.widgetManager.endtime,
      },
    };

    // using update options only prevented series from removing series
    // using the combo sets both the inital series and later updates
    if (!this.echartsInstance) {
      this.updateOptions = options;
    } else {
      this.echartsInstance.setOption(options, {
        replaceMerge: "series",
      });
    }
  }
}
