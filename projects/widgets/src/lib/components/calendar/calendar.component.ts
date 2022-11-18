import { Component, OnDestroy, OnInit } from "@angular/core";
import { Measurement } from "squacapi";

import { PrecisionPipe } from "../../shared/pipes/precision.pipe";

import {
  WidgetConnectService,
  WidgetManagerService,
  WidgetConfigService,
} from "../../services";
import { WidgetTypeComponent } from "../../interfaces";
import { EChartComponent } from "../abstract-components";
import { parseUtc } from "../../shared/utils";

@Component({
  selector: "widget-calendar-plot",
  templateUrl: "../e-chart/e-chart.component.html",
  styleUrls: ["../e-chart/e-chart.component.scss"],
})
export class CalendarComponent
  extends EChartComponent
  implements OnInit, WidgetTypeComponent, OnDestroy
{
  constructor(
    private widgetConfigService: WidgetConfigService,
    protected widgetConnectService: WidgetConnectService,
    protected widgetManager: WidgetManagerService
  ) {
    super(widgetManager, widgetConnectService);
  }

  xAxisLabels = [];
  xAxisLabels2 = []; //second row
  // Max allowable time between measurements to connect
  maxMeasurementGap: number = 1 * 1000;
  precisionPipe = new PrecisionPipe();

  configureChart(): void {
    const chartOptions = {
      xAxis: {
        type: "category",

        axisTick: {
          show: true,
        },
        axisLine: {
          show: true,
        },
        axisPointer: {
          show: "true",
          label: {
            formatter: (params) => {
              params = params.value.split("-");
              const labels = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ];
              if (params.length > 1) {
                const week = params[0];
                const time = params[1];
                return `${labels[+week]} ${time}:00`;
              } else {
                if (+params[0]) {
                  return `${params[0]}:00`;
                }
                return `${params[0]}`;
              }
            },
          },
        },
      },
      yAxis: {
        inverse: true,
        axisTick: {
          interval: 0,
        },
        type: "category",
        nameGap: 40, //max characters
      },
      tooltip: {
        formatter: (params) => {
          let str = "";
          str += `<div class='tooltip-name'>${params.marker} ${params.seriesName} </div>`;
          if (params.value) {
            str +=
              "<table class='tooltip-table'><tbody><tr><td>" +
              params.value[0] +
              "(average):</td><td>" +
              this.precisionPipe.transform(params.value[2]) +
              "</td></tr></tbody></table>";
          }
          return str;
        },
      },
      series: [],
    };

    this.options = this.widgetConfigService.chartOptions(chartOptions);
  }

  buildChartData(data) {
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

  changeMetrics() {
    const displayMetric = this.selectedMetrics[0];
    const colorMetric = this.selectedMetrics[0];
    const visualMap = this.visualMaps[colorMetric.id];
    const axes = [];

    let xAxis1: any = {
      type: "category",

      axisLine: {
        show: true,
      },
      axisPointer: {
        show: "true",
      },
    };
    let name = "";
    if (this.properties.displayType) {
      name = this.properties.displayType.replace("-", " of ");
    }

    xAxis1.name = name;
    xAxis1.position = "bottom";

    if (this.xAxisLabels2.length > 0) {
      xAxis1 = {
        ...xAxis1,
        axisTick: {
          alignWithLabel: false,
          length: 16,
          align: "left",
          interval: function (_index, value) {
            return value ? true : false;
          },
        },
        axisLabel: {
          margin: 16,
          fontSize: 11,
          align: "left",
          interval: function (_index, value) {
            return value ? true : false;
          },
        },
        axisPointer: {
          show: false,
        },
        splitLine: {
          show: true,
          interval: function (_index, value) {
            return value ? true : false;
          },
        },
      };
      const xAxis2 = {
        position: "bottom",
        data: this.xAxisLabels,
        nameGap: 28,
        name,
        axisLabel: {
          fontSize: 11,
          formatter: (value, _index) => {
            const val = value.split("-")[1];
            return val === "00" ? "" : val;
          },
        },
      };
      xAxis1.data = this.xAxisLabels2;

      axes.push(xAxis2);
      axes.push(xAxis1);
    } else {
      //just one axis
      xAxis1.data = this.xAxisLabels;
      axes.push(xAxis1);
    }
    this.updateOptions = {
      series: this.metricSeries[displayMetric.id].series,
      visualMap: visualMap,
      xAxis: axes,
      grid: {
        bottom: axes.length > 1 ? 24 : 38,
      },
      yAxis: {
        data: this.metricSeries[displayMetric.id].yAxisLabels,
      },
    };
  }
}
