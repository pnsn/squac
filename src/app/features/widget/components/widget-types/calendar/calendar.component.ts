import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { Channel } from "@core/models/channel";
import { Metric } from "@core/models/metric";
import { DateService } from "@core/services/date.service";
import { ViewService } from "@core/services/view.service";
import { Measurement } from "@features/widget/models/measurement";
import { Threshold } from "@features/widget/models/threshold";
import { Subscription } from "rxjs";
import { EChartsOption } from "echarts";
import { WidgetTypeComponent } from "../widget-type.component";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { WidgetConnectService } from "@features/widget/services/widget-connect.service";
import { PrecisionPipe } from "@shared/pipes/precision.pipe";

@Component({
  selector: "widget-calendar-plot",
  templateUrl: "../e-chart.component.html",
  styleUrls: ["../e-chart.component.scss"],
  providers: [WidgetTypeService],
})
export class CalendarComponent
  implements OnInit, OnChanges, WidgetTypeComponent
{
  constructor(
    private viewService: ViewService,
    private dateService: DateService,
    private widgetTypeService: WidgetTypeService,
    private widgetConnectService: WidgetConnectService
  ) {}
  @Input() data;
  @Input() metrics: Metric[];
  @Input() thresholds: Threshold[];
  @Input() channels: Channel[];
  @Input() selectedMetrics: Metric[];
  @Input() dataRange: any;
  @Input() properties: any;
  @Input() loading: string | boolean;
  @Output() loadingChange = new EventEmitter();
  emphasizedChannel: string;
  deemphasizedChannel: string;
  subscription = new Subscription();
  results: Array<any>;
  options = {};
  updateOptions = {};
  initOptions: EChartsOption = {};
  metricSeries = {};
  visualMaps = {};
  xAxisLabels = [];
  // Max allowable time between measurements to connect
  maxMeasurementGap: number = 1 * 1000;
  test = 0;
  echartsInstance;
  lastEmphasis;
  precisionPipe = new PrecisionPipe();

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (
      (changes.channels || changes.data) &&
      this.channels?.length > 0 &&
      this.selectedMetrics?.length > 0
    ) {
      this.buildChartData(this.data).then(() => {
        this.changeMetrics();
      });
    }
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
        name: "Measurement Start",

        axisTick: {
          show: true,
        },
        axisLine: {
          show: true,
        },
        axisPointer: {
          show: "true",
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
          str += `<h4> ${params.seriesName} </h4>`;
          if (params.value) {
            str +=
              "<table  style='border-collapse: separate;border-spacing: 3px 0;'><tr><td>" +
              params.value[0] +
              "</td><td> (average): </td><td>" +
              this.precisionPipe.transform(params.value[2]) +
              "</td></tr></table>";
          }
          return str;
        },
      },
      series: [],
    };

    this.options = this.widgetTypeService.chartOptions(chartOptions);
  }

  onChartEvent(event, type) {
    console.log(event, type);
  }

  onChartInit(event) {
    this.echartsInstance = event;
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
    this.loadingChange.emit("Building chart...");
    return new Promise<void>((resolve) => {
      this.metricSeries = {};
      this.visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
        this.selectedMetrics,
        this.thresholds,
        this.properties,
        this.dataRange,
        2
      );
      this.xAxisLabels = [];

      let width;

      switch (this.properties.displayType) {
        case "hour":
          width = "hour";
          break;

        default:
          width = "day";
          break;
      }

      console.log(width);
      this.channels.sort((chanA, chanB) => {
        return chanA.nslc.localeCompare(chanB.nslc);
      });
      this.channels.forEach((channel, index) => {
        const nslc = channel.nslc.toUpperCase();
        this.selectedMetrics.forEach((metric) => {
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

          if (data[channel.id] && data[channel.id][metric.id]) {
            let start;
            let count = 0;
            let total = 0;
            //trusts that measurements are in order of time
            data[channel.id][metric.id].forEach(
              (measurement: Measurement, mIndex: number) => {
                if (!start) {
                  start = this.dateService
                    .parseUtc(measurement.starttime)
                    .startOf(width);
                }

                const measurementStart = this.dateService.parseUtc(
                  measurement.starttime
                );

                if (nslc === "CC.SEP.--.BHE") {
                  console.log(
                    start.format("MMM DD HH:00"),
                    measurementStart.format("MMM DD HH:00")
                  );
                }

                // if next day/hour, end last time segment and start new one
                if (
                  !measurementStart.isSame(start, width) ||
                  mIndex === data[channel.id][metric.id].length - 1
                ) {
                  //   .toDate();
                  const avg = total / count;
                  let startString;
                  if (width === "day") {
                    startString = start.startOf(width).utc().format("MMM DD");
                  } else {
                    startString = start
                      .startOf(width)
                      .utc()
                      .format("MMM DD HH:00");
                  }

                  if (this.xAxisLabels.indexOf(startString) === -1) {
                    this.xAxisLabels.push(startString);
                  }

                  channelObj.data.push({
                    name: nslc,
                    value: [startString, count, avg, index],
                  });

                  if (nslc === "CC.SEP.--.BHE") {
                    console.log(startString, count, avg);
                  }

                  total = 0;
                  count = 0;
                  start = this.dateService
                    .parseUtc(measurement.starttime)
                    .startOf(width);
                }

                count += 1;
                total += measurement.value;
              }
            );
          }

          if (!this.metricSeries[metric.id]) {
            this.metricSeries[metric.id] = {
              series: [],
              yAxisLabels: [],
            };
          }
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

    this.loadingChange.emit(false);
    this.updateOptions = {
      series: this.metricSeries[displayMetric.id].series,
      visualMap: visualMap,
      title: { text: `${displayMetric.name} (${displayMetric.unit})` },
      xAxis: {
        data: this.xAxisLabels,
      },
      yAxis: {
        data: this.metricSeries[displayMetric.id].yAxisLabels,
      },
    };
  }
}
