import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { Channel } from "@squacapi/models/channel";
import { Metric } from "@squacapi/models/metric";
import { DateService } from "@core/services/date.service";
import { Measurement } from "@squacapi/models/measurement";
import { Threshold } from "@squacapi/models/threshold";
import { Subscription } from "rxjs";
import { EChartsOption } from "echarts";
import { WidgetTypeComponent } from "../widget-type.component";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { WidgetConnectService } from "@features/widget/services/widget-connect.service";
import { PrecisionPipe } from "@shared/pipes/precision.pipe";
import { WidgetManagerService } from "@features/widget/services/widget-manager.service";

@Component({
  selector: "widget-calendar-plot",
  templateUrl: "../e-chart.component.html",
  styleUrls: ["../e-chart.component.scss"],
})
export class CalendarComponent
  implements OnInit, OnChanges, WidgetTypeComponent, OnDestroy
{
  constructor(
    private dateService: DateService,
    private widgetTypeService: WidgetTypeService,
    private widgetConnectService: WidgetConnectService,
    private widgetManager: WidgetManagerService
  ) {}
  data;
  channels: Channel[];
  selectedMetrics: Metric[];
  properties: any;

  @Input() showKey: boolean;
  @Input() zooming: string;
  @Output() zoomingChange = new EventEmitter();
  emphasizedChannel: string;
  deemphasizedChannel: string;
  subscription = new Subscription();
  results: Array<any>;
  options: any = {};
  updateOptions = {};
  initOptions: EChartsOption = {};
  metricSeries = {};
  visualMaps = {};
  xAxisLabels = [];
  xAxisLabels2 = []; //second row
  // Max allowable time between measurements to connect
  maxMeasurementGap: number = 1 * 1000;
  test = 0;
  echartsInstance;
  lastEmphasis;
  precisionPipe = new PrecisionPipe();

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.showKey) {
      this.toggleKey();
    }
    if (changes.zooming) {
      this.startZoom();
    }
  }

  updateData(data: any): void {
    this.data = data;
    this.channels = this.widgetManager.channels;
    this.selectedMetrics = this.widgetManager.selectedMetrics;
    this.properties = this.widgetManager.properties;
    this.buildChartData(this.data).then(() => {
      this.changeMetrics();
    });
  }
  ngOnInit(): void {
    //override defaults

    const deemphsSub = this.widgetConnectService.deemphasizeChannel.subscribe(
      (channel) => {
        this.deemphasizeChannel(channel);
      }
    );
    const emphSub = this.widgetConnectService.emphasizedChannel.subscribe(
      (channel) => {
        this.emphasizeChannel(channel);
      }
    );
    this.subscription.add(emphSub);
    this.subscription.add(deemphsSub);
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

    this.options = this.widgetTypeService.chartOptions(chartOptions);
  }

  toggleKey() {
    if (this.echartsInstance) {
      this.echartsInstance.setOption({
        visualMap: {
          show: this.showKey,
        },
      });
    }
  }

  onChartEvent(event, type) {
    console.log(event, type);
  }

  onChartInit(event) {
    this.echartsInstance = event;
  }

  startZoom() {
    if (this.echartsInstance) {
      if (this.zooming === "start") {
        this.echartsInstance.dispatchAction({
          type: "takeGlobalCursor",
          key: "dataZoomSelect",
          // Activate or inactivate.
          dataZoomSelectActive: true,
        });
      } else {
        this.echartsInstance.dispatchAction({
          type: "takeGlobalCursor",
          key: "dataZoomSelect",
          // Activate or inactivate.
          dataZoomSelectActive: false,
        });
        if (this.zooming === "reset") {
          this.resetZoom();
        }
      }
    }
  }

  resetZoom() {
    this.echartsInstance.dispatchAction({
      type: "dataZoom",
      start: 0,
      end: 100,
    });
  }

  zoomStopped(event) {
    if (event.batch?.length !== 1) {
      this.zoomingChange.emit("stop");
    }
  }

  emphasizeChannel(channel) {
    if (this.echartsInstance) {
      this.echartsInstance.dispatchAction({
        type: "highlight",
        seriesName: channel,
      });
    }
  }

  deemphasizeChannel(channel) {
    if (this.echartsInstance) {
      this.echartsInstance.dispatchAction({
        type: "downplay",
        seriesName: channel,
      });
    }
  }

  buildChartData(data) {
    return new Promise<void>((resolve) => {
      this.metricSeries = {};
      this.visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
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
              const measurementStart = this.dateService.parseUtc(
                measurement.starttime
              );

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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.echartsInstance = null;
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
    const name = this.properties.displayType.replace("-", " of ");
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
