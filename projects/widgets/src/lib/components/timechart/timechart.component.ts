import { Component, OnDestroy, OnInit } from "@angular/core";
import * as dayjs from "dayjs";
import { Measurement } from "squacapi";

import { EChartsOption, TooltipComponentPositionCallbackParams } from "echarts";
import { LabelFormatterParams, WidgetTypeComponent } from "../../interfaces";
import {
  WidgetConfigService,
  WidgetConnectService,
  WidgetManagerService,
} from "../../services";
import { parseUtc } from "../../shared/utils";
import { EChartComponent } from "../abstract-components";

/**
 * Time series widget with channels as lines
 */
@Component({
  selector: "widget-timechart",
  templateUrl: "../e-chart/e-chart.component.html",
  styleUrls: ["../e-chart/e-chart.component.scss"],
})
export class TimechartComponent
  extends EChartComponent
  implements OnInit, WidgetTypeComponent, OnDestroy
{
  constructor(
    private widgetConfigService: WidgetConfigService,
    protected widgetConnectService: WidgetConnectService,
    override widgetManager: WidgetManagerService
  ) {
    super(widgetManager, widgetConnectService);
  }
  // Max allowable time between measurements to connect
  maxMeasurementGap = 1.5;

  /**
   * @override
   */
  configureChart(): void {
    const chartOptions: EChartsOption = {
      xAxis: {
        type: "time",
        nameLocation: "middle",
        name: "Measurement Start Date",
        nameGap: 14,
        axisPointer: {
          show: true,
          label: {
            formatter: (params: LabelFormatterParams) =>
              this.widgetConfigService.timeAxisPointerLabelFormatting(params),
          },
        },
        axisLabel: {
          fontSize: 11,
          margin: 3,
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
        },
        axisLine: {
          show: true,
        },
        axisTick: {
          show: true,
        },
      },
      tooltip: {
        formatter: (params: TooltipComponentPositionCallbackParams) => {
          return this.widgetConfigService.timeAxisFormatToolTip(params);
        },
      },
    };

    this.options = this.widgetConfigService.chartOptions(chartOptions);
  }

  /**
   * @override
   */
  buildChartData(data): Promise<void> {
    return new Promise<void>((resolve) => {
      this.visualMaps = this.widgetConfigService.getVisualMapFromThresholds(
        this.selectedMetrics,
        this.properties,
        2
      );
      const stations = [];
      this.metricSeries = {};
      const series = {
        type: "line",
        large: true,
        largeThreshold: 1000,
        legendHoverLink: true,
        lineStyle: {
          width: 1,
          opacity: 1,
        },
        emphasis: {
          focus: "series",
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
            },
          },
        };
        let lastEnd: dayjs.Dayjs;
        if (data.has(channel.id)) {
          const measurements = data.get(channel.id).get(metric.id);
          measurements?.forEach((measurement: Measurement) => {
            // // If time between measurements is greater than gap, don't connect
            const start = parseUtc(measurement.starttime);
            const end = parseUtc(measurement.endtime);

            const diff = start.diff(end, "seconds");
            if (
              station.data.length > 0 &&
              lastEnd &&
              diff >= metric.sampleRate * this.maxMeasurementGap
            ) {
              // time since last measurement
              station.data.push({
                name: nslc,
                value: [lastEnd.toDate(), start.toDate(), "-"],
              });
            }

            station.data.push({
              name: nslc,
              value: [start.toDate(), end.toDate(), measurement.value],
            });

            lastEnd = end;
          });
        }
        stations.push(station);
      });
      this.metricSeries.series = stations;
      resolve();
    });
  }

  /**
   * @override
   */
  changeMetrics(): void {
    const colorMetric = this.selectedMetrics[0];
    const visualMaps = this.visualMaps[colorMetric.id];
    this.updateOptions = {
      series: this.metricSeries.series,
      visualMap: visualMaps,
      xAxis: {
        min: this.widgetManager.starttime,
        max: this.widgetManager.endtime,
      },
    };

    if (this.echartsInstance) {
      this.echartsInstance.setOption(this.updateOptions, {
        replaceMerge: ["series", "xAxis"],
      });
    }
  }
}
