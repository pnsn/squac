import { Component, OnDestroy, OnInit } from "@angular/core";
import { Measurement } from "squacapi";

import { PrecisionPipe } from "../../shared/pipes/precision.pipe";
import {
  EChartsOption,
  TooltipComponentFormatterCallbackParams,
  XAXisComponentOption,
} from "echarts";
import {
  WidgetConnectService,
  WidgetManagerService,
  WidgetConfigService,
} from "../../services";
import { LabelFormatterParams, WidgetTypeComponent } from "../../interfaces";
import { EChartComponent } from "../../shared/components";
import { parseUtc } from "../../shared/utils";

/**
 * Chart that plots channels as the y axis and time,
 * grouped into chunks of time on x axis
 */
@Component({
  selector: "widget-calendar-plot",
  templateUrl: "../../shared/components/e-chart/e-chart.component.html",
  styleUrls: ["../../shared/components/e-chart/e-chart.component.scss"],
})
export class CalendarComponent
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

  xAxisLabels = [];
  xAxisLabels2 = []; //second row
  // Max allowable time between measurements to connect
  maxMeasurementGap: number = 1 * 1000;
  precisionPipe = new PrecisionPipe();
  override denseOptions: {
    grid: {
      containLabel: true;
      left: number;
      top: number;
      right: number;
      bottom?: number;
    };
    dataZoom: any[];
  } = {
    grid: {
      containLabel: true,
      top: 5,
      right: 10,
      left: 10,
    },
    dataZoom: [],
  };
  override fullOptions = {
    grid: {
      containLabel: true,
      top: 5,
      right: 10,
      left: 30,
    },
    dataZoom: this.chartDefaultOptions.dataZoom,
  };

  grid: {
    containLabel: boolean;
    left: number;
    top: number;
    right: number;
    bottom?: number;
  };

  xAxisConfig: XAXisComponentOption = {
    type: "category",
    axisLabel: {
      fontSize: 11,
      margin: 3,
      hideOverlap: true,
    },
    position: "bottom",
    axisTick: {
      show: true,
    },
    axisLine: {
      show: true,
    },
    nameLocation: "middle",
  };

  axisPointer = {
    show: true,
    label: {
      formatter: (params: LabelFormatterParams): string => {
        const pa = (params.value as string).split("-");
        const labels = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        if (pa.length > 1) {
          const week = pa[0];
          const time = pa[1];
          return `${labels[+week]} ${time}:00`;
        } else {
          if (+pa[0]) {
            return `${pa[0]}:00`;
          }
          return `${pa[0]}`;
        }
      },
    },
  };

  /**
   * @override
   */
  configureChart(): void {
    const bottomMargin = this.getBottomMargin();
    const dataZoom = this.denseView
      ? this.denseOptions.dataZoom
      : this.fullOptions.dataZoom;
    const grid = this.denseView
      ? this.denseOptions.grid
      : this.fullOptions.grid;
    this.options = {
      ...this.chartDefaultOptions,
      grid: {
        ...grid,
        bottom: bottomMargin,
      },
      dataZoom,
      yAxis: {
        inverse: true,
        axisLabel: {
          fontSize: 11,
        },
        axisTick: {
          interval: 0,
        },
        type: "category",
        // nameGap: 35, //max characters
      },
      xAxis: { ...this.xAxisConfig }, //have default xaxis config or error occurs
      tooltip: {
        ...this.chartDefaultOptions.tooltip,
        formatter: (
          params: TooltipComponentFormatterCallbackParams
        ): string => {
          let str = "";
          if (!Array.isArray(params)) {
            str += `<div class='tooltip-name'>${params.marker} ${params.seriesName} </div>`;
            if (params.value) {
              str += `<table class='tooltip-table'><tbody><tr><td>${
                params.value[0]
              }(average):</td><td>${
                params.value[2]?.toPrecision(4) ?? "No Data"
              }</td></tr></tbody></table>`;
            }
          }
          return str;
        },
      },
      series: [],
    };
  }

  /**
   * @override
   */
  buildChartData(data): Promise<void> {
    return new Promise<void>((resolve) => {
      this.metricSeries = {};
      this.visualMaps = this.widgetConfigService.getVisualMapFromThresholds(
        this.selectedMetrics,
        this.properties,
        2
      );

      this.xAxisLabels = [];
      this.xAxisLabels2 = [];
      let width;

      const weekLabels = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const hourLabels = [];
      const blanks = new Array(23);
      blanks.fill("");
      for (let i = 0; i < 24; i++) {
        const label = i < 10 ? `0${i}` : `${i}`;
        hourLabels.push(label);
      }

      switch (this.properties.displayType) {
        case "hours-day":
          this.xAxisLabels = [...hourLabels];
          width = "hours-day";
          break;

        case "hours-week":
          width = "hours-week";
          this.xAxisLabels = [];
          weekLabels.forEach((weekLabel, j) => {
            this.xAxisLabels2.push(weekLabel, ...blanks);

            hourLabels.forEach((label) => {
              this.xAxisLabels.push(`${j}-${label}`);
            });
          });

          break;

        default:
          width = "days-week";
          this.xAxisLabels = [...weekLabels];
          break;
      }

      this.channels.sort((chanA, chanB) => {
        return chanA.nslc.localeCompare(chanB.nslc);
      });
      this.channels.forEach((channel, index) => {
        // store values
        const values = [];

        //associate data with created labels
        this.xAxisLabels.forEach((label) => {
          values.push({
            label,
            sum: 0,
            count: 0,
          });
        });

        const nslc = channel.nslc;
        this.selectedMetrics.forEach((metric) => {
          if (!metric) return;
          const channelObj = {
            type: "heatmap",
            name: nslc,
            data: [],
            large: true,
            emphasis: { focus: "series" },
            blur: {
              itemStyle: { opacity: 0.7 },
            },
            encode: {
              x: 0,
              y: 3,
              tooltip: [0, 1, 3],
            },
          };
          if (!this.metricSeries[metric.id]) {
            this.metricSeries[metric.id] = {
              series: [],
              yAxisLabels: [],
            };
          }

          if (data.has(channel.id)) {
            const measurements = data.get(channel.id).get(metric.id);
            //trusts that measurements are in order of time
            measurements?.forEach((measurement: Measurement) => {
              const measurementStart = parseUtc(measurement.starttime);

              let timeSegment;
              if (width === "days-week") {
                timeSegment = measurementStart.day();
              } else if (width === "hours-day") {
                timeSegment = measurementStart.hour();
              } else if (width === "hours-week") {
                const weekday = measurementStart.day();
                const hour = measurementStart.hour();

                timeSegment = hour + weekday * 24;
              }

              if (values[timeSegment]) {
                values[timeSegment].count++;
                values[timeSegment].sum += measurement.value;
              }
            });
          }

          values.forEach((value) => {
            const avg = value.count > 0 ? value.sum / value.count : null;
            channelObj.data.push({
              name: nslc,
              value: [value.label, value.count, avg, index],
            });
          });

          this.metricSeries[metric.id].series.push(channelObj);
          this.metricSeries[metric.id].yAxisLabels.push(nslc);
        });
      });
      resolve();
    });
  }

  /** @returns margin for bottom of chart */
  private getBottomMargin(): number {
    //denseview has no zoom bar
    let margin = this.denseView ? 0 : 24;

    if (
      this.properties.displayType !== "hours-week" &&
      this.denseView !== undefined
    ) {
      margin += 14;
    }
    return margin;
  }

  /**
   * @override
   */
  changeMetrics(): void {
    const displayMetric = this.selectedMetrics[0];
    const colorMetric = this.selectedMetrics[0];
    const visualMaps = this.visualMaps[colorMetric.id];
    const axes = [];

    let xAxis1: EChartsOption = {
      ...this.xAxisConfig,
    };
    let name = "";
    if (this.properties.displayType) {
      name = this.properties.displayType.replace("-", " of ");
    }
    if (this.xAxisLabels2.length > 0) {
      xAxis1 = {
        ...xAxis1,
        axisTick: {
          show: true,
          alignWithLabel: false,
          length: 16,
          inside: false,
          interval: (_index: number, value: string): boolean => {
            return value ? true : false;
          },
        },
        axisLabel: {
          margin: 14,
          hideOverlap: true,
          fontSize: 11,
          align: "left",
          interval: (_index: number, value: string): boolean => {
            return value ? true : false;
          },
        },
        axisPointer: {
          show: false,
        },
        splitLine: {
          show: true,
          interval: (_index: number, value: string): boolean => {
            return value ? true : false;
          },
        },
      };

      const xAxis2 = {
        ...this.xAxisConfig,
        data: this.xAxisLabels,
        nameGap: 26,
        name,
        axisLabel: {
          hideOverlap: true,
          fontSize: 11,
          formatter: (value: string): string => {
            const val = value.split("-")[1];
            return val === "00" ? "" : val;
          },
        },
        axisPointer: this.axisPointer,
      };
      xAxis1["data"] = this.xAxisLabels2;

      axes.push(xAxis2);
      axes.push(xAxis1);
    } else {
      //just one axis
      xAxis1["data"] = this.xAxisLabels;
      xAxis1["axisPointer"] = this.axisPointer;
      xAxis1["name"] = name;
      axes.push(xAxis1);
    }

    visualMaps.show = this.showKey;
    this.updateOptions = {
      series: this.metricSeries[displayMetric.id].series,
      visualMap: visualMaps,
      xAxis: axes,
      yAxis: {
        data: this.metricSeries[displayMetric.id].yAxisLabels,
      },
    };
  }
}
