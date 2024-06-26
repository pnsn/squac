import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Measurement, MeasurementTypes } from "squacapi";
import {
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemReturn,
  EChartsOption,
  graphic,
  TooltipComponentFormatterCallbackParams,
} from "echarts";

import {
  WidgetConnectService,
  WidgetManagerService,
  WidgetConfigService,
} from "../../services";
import { WidgetTypeComponent } from "../../interfaces";
import { EChartComponent } from "../../components/e-chart/e-chart.component";
import { parseUtc } from "../../utils";
import { LabelFormatterParams } from "../../interfaces";
import { OpUnitType } from "dayjs";
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from "ngx-echarts";
import { WidgetErrors } from "../../enums";

/**
 * Custom echart widget
 */
@Component({
  selector: "widget-timeline",
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
export class TimelineComponent
  extends EChartComponent
  implements OnInit, WidgetTypeComponent, OnDestroy
{
  constructor(
    private widgetConfigService: WidgetConfigService,
    override widgetConnector: WidgetConnectService,
    override widgetManager: WidgetManagerService,
    override ngZone: NgZone
  ) {
    super(widgetManager, widgetConnector, ngZone);
  }
  // Max allowable time between measurements to connect
  maxMeasurementGap: number = 1 * 1000;
  xAxisLabels = [];

  /**
   * @override
   */
  configureChart(): void {
    const dataZoom = this.denseView
      ? this.denseOptions.dataZoom
      : this.fullOptions.dataZoom;
    const grid = this.denseView
      ? this.denseOptions.grid
      : this.fullOptions.grid;
    this.options = {
      ...this.chartDefaultOptions,
      grid,
      dataZoom,
      xAxis: {
        type: "time",
        nameLocation: "middle",
        name: "Measurement Start Date",
        nameGap: 15,
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
      tooltip: {
        ...this.chartDefaultOptions.tooltip,
        formatter: (params: TooltipComponentFormatterCallbackParams) =>
          this.widgetConfigService.timeAxisFormatToolTip(params),
      },
      yAxis: {
        inverse: true,
        axisTick: {
          interval: 0,
        },
        axisLabel: {
          fontSize: 11,
          width: 110,
          overflow: "truncate",
        },
        type: "category",
        // nameGap: 35, //max characters
      },
      series: [],
    };
  }

  /**
   * @override
   */
  buildChartData(data: MeasurementTypes[]): Promise<void> {
    return new Promise<void>((resolve) => {
      this.metricSeries = {};

      const defaultSeries = {
        large: true,
        encode: {
          x: 0,
          y: 3,
        },
        emphasis: {
          focus: "series",
          itemStyle: {
            borderWidth: 1,
          },
        },
      };
      this.xAxisLabels = [];

      this.channels.forEach((channel, index) => {
        const nslc = channel.nslc;
        this.selectedMetrics.forEach((metric) => {
          if (!metric) return;
          if (!this.metricSeries[metric.id]) {
            this.metricSeries[metric.id] = {
              series: [],
              yAxisLabels: [],
            };
          }

          const measurements = data
            .filter((m) => m.channel === channel.id && m.metric === metric.id)
            .map((m) => {
              m.value = m.value ?? m[this.widgetManager.dataStat];
              this.widgetConfigService.calculateDataRange(metric.id, m.value);
              return m;
            });

          let series;
          switch (this.properties.displayType) {
            case "hour":
              series = this.makeSeriesForFixed(
                nslc,
                measurements,
                index,
                "hour" as OpUnitType
              );
              break;
            case "day":
              series = this.makeSeriesForFixed(
                nslc,
                measurements,
                index,
                "day" as OpUnitType
              );
              break;
            default:
              series = this.makeSeriesForRaw(nslc, measurements, index);
              break;
          }

          const channelObj = {
            ...defaultSeries,
            ...series,
          };
          this.metricSeries[metric.id].series.push(channelObj);

          this.metricSeries[metric.id].yAxisLabels.push(nslc);
        });
      });

      this.visualMaps = this.widgetConfigService.getVisualMapFromThresholds(
        this.selectedMetrics,
        this.properties,
        2
      );
      resolve();
    });
  }

  /**
   * Generate echart series for fixed width time ranges
   *
   * @param nslc - nslc of channel
   * @param data - channel data
   * @param index - index of series
   * @param width - width of time range
   * @returns series configuration
   */
  makeSeriesForFixed(
    nslc: string,
    data: MeasurementTypes[],
    index: number,
    width: OpUnitType
  ): EChartsOption {
    const channelObj = {
      type: "heatmap",
      name: nslc,
      data: [],
    };

    let start;
    let count = 0;
    let total = 0;
    //trusts that measurements are in order of time
    data.forEach((measurement: MeasurementTypes, mIndex: number) => {
      if (!start) {
        start = parseUtc(measurement.starttime).startOf(width);
      }

      const measurementStart = parseUtc(measurement.starttime);

      // if next day/hour, end last time segment and start new one
      if (
        !measurementStart.isSame(start, width) ||
        mIndex === data.length - 1
      ) {
        //   .toDate();
        const avg = total / count;
        let startString;
        if (width === "day") {
          startString = start.startOf(width).utc().format("MMM DD");
        } else {
          startString = start.startOf(width).utc().format("MMM DD HH:00");
        }

        if (this.xAxisLabels.indexOf(startString) === -1) {
          this.xAxisLabels.push(startString);
        }

        channelObj.data.push({
          name: nslc,
          value: [startString, count, avg, index],
        });

        total = 0;
        count = 0;
        start = parseUtc(measurement.starttime).startOf(width);
      }

      count += 1;
      total += measurement.value;
    });

    return channelObj;
  }

  /**
   * Make echarts series for raw measurements
   *
   * @param nslc - nslc of channel
   * @param data - channel data
   * @param index - series index
   * @returns echarts configuration
   */
  makeSeriesForRaw(
    nslc: string,
    data: MeasurementTypes[],
    index: number
  ): EChartsOption {
    const channelObj = {
      type: "custom",
      name: nslc,
      data: [],
      renderItem: this.renderItem,
    };

    data.forEach((measurement: Measurement) => {
      const start = parseUtc(measurement.starttime).toDate();
      const end = parseUtc(measurement.endtime).toDate();
      channelObj.data.push({
        name: nslc,
        value: [start, end, measurement.value, index],
      });
    });

    return channelObj;
  }

  /**
   * @override
   */
  changeMetrics(): void {
    const displayMetric = this.selectedMetrics[0];
    const colorMetric = this.selectedMetrics[0];
    const visualMaps = this.visualMaps[colorMetric.id];
    if (!visualMaps) {
      this.widgetManager.errors$.next(WidgetErrors.NO_MEASUREMENTS);
    }
    visualMaps.show = this.showKey;
    let xAxis = { ...this.options.xAxis };
    if (
      this.properties.displayType === "hour" ||
      this.properties.displayType === "day"
    ) {
      xAxis = {
        ...xAxis,
        type: "category",
        axisPointer: {
          show: true,
        },
        data: this.xAxisLabels,
        axisLabel: {
          fontSize: 11,
          margin: 3,
        },
      };
    } else {
      xAxis = {
        ...xAxis,
        type: "time",
        min: this.widgetManager.starttime,
        max: this.widgetManager.endtime,
        axisLabel: {
          formatter: this.widgetConfigService.timeAxisTickFormatting.bind(this),
          fontSize: 11,
          margin: 3,
          hideOverlap: true,
        },
        axisPointer: {
          show: true,
          label: {
            formatter: this.widgetConfigService.timeAxisPointerLabelFormatting,
          },
        },
      };
    }
    const options = {
      yAxis: {
        data: this.metricSeries[displayMetric.id]?.yAxisLabels,
      },
      series: this.metricSeries[displayMetric.id]?.series,
      visualMap: visualMaps,
      xAxis,
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

  /**
   * Render function for echart
   *
   * @param params - customs series params
   * @param api - api for render
   * @returns custom series render
   */
  renderItem(
    params: any,
    api: CustomSeriesRenderItemAPI
  ): CustomSeriesRenderItemReturn {
    const categoryIndex = api.value(3);
    const start = api.coord([api.value(0), categoryIndex]); //converts to xy coords
    const end = api.coord([api.value(1), categoryIndex]); //converts to xy coords
    const height = api.size([0, 1])[1] * 1;
    const rectShape = graphic.clipRectByRect(
      {
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height: height,
      },
      {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height,
      }
    );
    return (
      rectShape && {
        type: "rect",
        transition: ["shape"],
        focus: "series",
        blur: {
          style: {
            opacity: 0.7,
          },
        },
        shape: {
          x: start[0],
          y: start[1] - height / 2,
          width: end[0] - start[0],
          height: height,
        },
        style: {
          fill: api.visual("color"),
        },
      }
    );
  }
}
