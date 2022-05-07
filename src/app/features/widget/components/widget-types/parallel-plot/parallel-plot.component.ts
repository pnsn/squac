import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { Channel } from "@core/models/channel";
import { ChannelGroup } from "@core/models/channel-group";
import { Metric } from "@core/models/metric";
import { DateService } from "@core/services/date.service";
import { ViewService } from "@core/services/view.service";
import { NetworkAdapter } from "@features/channel-group/models/network";
import { Measurement } from "@features/widget/models/measurement";
import { Threshold } from "@features/widget/models/threshold";
import { Widget } from "@features/widget/models/widget";
import { MeasurementPipe } from "@features/widget/pipes/measurement.pipe";
import * as dayjs from "dayjs";
import { Subscription } from "rxjs";

@Component({
  selector: "widget-parallel-plot",
  templateUrl: "./parallel-plot.component.html",
  styleUrls: ["./parallel-plot.component.scss"],
  providers: [MeasurementPipe],
})
export class ParallelPlotComponent implements OnInit {
  constructor(
    private viewService: ViewService,
    private dateService: DateService,
    private measurementPipe: MeasurementPipe
  ) {}
  @Input() widget: Widget;
  @Input() data;
  metrics: Metric[];
  rows = [];
  thresholds: { [metricId: number]: Threshold };
  channelGroup: ChannelGroup;
  schema = [];
  channels: Channel[] = [];
  subscription = new Subscription();
  results: Array<any>;
  hasData: boolean;
  referenceLines;
  xAxisLabel = "Measurement Start Date";
  yAxisLabel: string;
  currentMetric: Metric;
  colorScheme = {
    domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
  };
  options = {};
  updateOptions = {};
  xScaleMin;
  xScaleMax;
  yScaleMin;
  yScaleMax;
  initOptions = {};

  // Max allowable time between measurements to connect
  maxMeasurementGap: number = 1 * 1000;
  test = 0;

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.data && this.channels.length > 0) {
      // this.buildChartData(this.data);
      console.log("data changed");
    }
  }
  ngOnInit(): void {
    this.metrics = this.widget.metrics;

    this.thresholds = this.widget.thresholds;
    this.channelGroup = this.widget.channelGroup;
    if (this.channelGroup) {
      this.channels = this.channelGroup.channels;
    }

    console.log("init");
    this.buildRows(this.data);
    // const pieces = this.addThresholds();
    // console.log(pieces);
    // const legendOffset = //pieces.length;

    this.options = {
      grid: {
        containLabel: true,
        left: "30",
        right: "15%",
        bottom: "30",
      },
      useUtc: true,
      parallel: {
        left: "5%",
        right: "18%",
        bottom: 100,
        parallelAxisDefault: {
          type: "value",
          nameLocation: "end",
          nameGap: 20,
          nameTextStyle: {
            color: "#fff",
            fontSize: 12,
          },
          axisLine: {
            lineStyle: {
              color: "#aaa",
            },
          },
          axisTick: {
            lineStyle: {
              color: "#777",
            },
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            color: "#fff",
          },
        },
      },
      dataZoom: [],
      series: [],
    };
  }

  // addThresholds(): Array<any> {
  //   const pieces = [];
  //   if (this.thresholds[this.currentMetric.id]) {
  //     const piece = {};
  //     // thresholds.forEach((threshold)=>{  }) //allow multople
  //     const threshold = this.thresholds[this.currentMetric.id];
  //     if (threshold.min || threshold.min === 0) {
  //       piece["min"] = threshold.min;
  //     }
  //     if (threshold.max || threshold.max === 0) {
  //       piece["max"] = threshold.max;
  //     }
  //     piece["color"] = "#AA069F";
  //     pieces.push(piece);
  //   }

  //   return pieces;
  // }

  private buildRows(data) {
    const series = [];
    this.schema = [];
    this.channels.forEach((channel) => {
      const channelSeries = {
        name: channel.nslc,
        type: "parallel",
        lineStyle: {
          width: 1,
          opacity: 0.5,
        },
        data: [],
        large: true,
      };
      this.metrics.forEach((metric, i) => {
        this.schema.push({
          name: metric.name,
          text: metric.name,
          index: i,
        });

        const statType = this.widget.stattype.type;

        let val: number = null;

        if (data[channel.id] && data[channel.id][metric.id]) {
          const rowData = data[channel.id][metric.id];
          // if it has value, show value else find the staType to show
          if (rowData[0] && rowData[0].value) {
            if (rowData.length > 0) {
              val = this.measurementPipe.transform(rowData, statType);
            } else {
              val = rowData[0].value;
            }
            // still need to calculate
          } else if (
            rowData[0][statType] !== undefined &&
            rowData[0][statType] !== null
          ) {
            val = rowData[0][statType];
          }
        }
        channelSeries.data.push(val);
      });

      series.push(channelSeries);
    });
    const parallelAxis = this.schema.map((val) => {
      return {
        dim: val.index,
        name: val.name,
      };
    });
    this.updateOptions = {
      series: series,
      parallelAxis: parallelAxis,
    };
    console.log(series);
  }

  // buildChartData(data) {
  //   let max;
  //   let min;

  //   this.results = [];

  //   // this.addThresholds();
  //   this.xAxisLabel = "Measurement Time";
  //   this.yAxisLabel = this.currentMetric ? this.currentMetric.unit : "Unknown";
  //   this.channels.forEach((channel) => {
  //     const channelObj = {
  //       name: channel.nslc,
  //       type: "line",
  //       data: [],
  //       large: true,
  //     };

  //     if (data[channel.id] && data[channel.id][this.currentMetric.id]) {
  //       let lastEnd: dayjs.Dayjs;
  //       data[channel.id][this.currentMetric.id].forEach(
  //         (measurement: Measurement) => {
  //           if (!min || !max) {
  //             min = measurement.value;
  //             max = measurement.value;
  //           } else if (measurement.value > max) {
  //             max = measurement.value;
  //           } else if (measurement.value < min) {
  //             min = measurement.value;
  //           }

  //           // // If time between measurements is greater than gap, don't connect
  //           if (channelObj.data.length > 0 && lastEnd) {
  //             // time since last measurement
  //             const start = this.dateService.parseUtc(measurement.starttime);

  //             const diff = this.dateService.diff(start, lastEnd);

  //             if (
  //               diff >=
  //               this.currentMetric.sampleRate * this.maxMeasurementGap
  //             ) {
  //               this.results.push({
  //                 name: channelObj.name,
  //                 type: "line",
  //                 data: channelObj.data,
  //                 large: true,
  //               });
  //               channelObj.data = [];
  //             }
  //           }
  //           let start = this.dateService
  //             .parseUtc(measurement.starttime)
  //             .toDate();
  //           // let start = measurement.starttime;
  //           channelObj.data.push([start, measurement.value]);

  //           // meas end
  //           // channelObj.data.push([measurement.endtime, measurement.value]);

  //           lastEnd = this.dateService.parseUtc(measurement.endtime);
  //         }
  //       );
  //       // console.log(channelObj);
  //       this.hasData = !this.hasData
  //         ? data[channel.id][this.currentMetric.id].length > 0
  //         : this.hasData;
  //     }

  //     if (channelObj.data.length > 0) {
  //       this.results.push(channelObj);
  //     }
  //   });

  //   //yaxis label placement

  //   this.yScaleMax = Math.round(max) + 25;
  //   this.yScaleMin = Math.round(min) - 25;

  //   this.viewService.startdate;
  //   this.viewService.enddate;
  //   this.updateOptions = {
  //     series: this.results,
  //     useUtc: true,
  //     xAxis: {
  //       name: this.xAxisLabel,
  //       min: this.viewService.startdate,
  //       max: this.viewService.enddate,
  //     },
  //     yAxis: {
  //       name: this.yAxisLabel,
  //       nameGap: this.yAxisLabelPosition(min, max),
  //     },
  //   };
  // }
  //calculate y axis position to prevent overlap
  yAxisLabelPosition(min, max): number {
    const minLen = Math.round(min).toString().length;
    const maxLen = Math.round(max).toString().length;

    return Math.max(minLen, maxLen) * 10 + 10;
  }

  xAxisTooltipLabelFormatting(val) {
    const value = new Date(val);
    let formatOptions = {};
    formatOptions = {
      //have to reassign it this way or linter won't allow it set
      second: "2-digit",
      minute: "2-digit",
      hour: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
      timeZone: "UTC",
    };
    const string = new Intl.DateTimeFormat("en-US", formatOptions).format(
      value
    );
    console.log(value, string);
    return string;
  }

  xAxisTickFormatting(val, index?) {
    const value = new Date(val);
    let formatOptions;
    if (value.getSeconds() !== 0) {
      formatOptions = { second: "2-digit" };
    } else if (value.getMinutes() !== 0) {
      formatOptions = { hour: "2-digit", minute: "2-digit" };
    } else if (value.getHours() !== 0) {
      formatOptions = { hour: "2-digit", minute: "2-digit" };
    } else if (value.getDate() !== 1) {
      formatOptions =
        value.getDay() === 0
          ? { month: "short", day: "2-digit" }
          : { month: "short", day: "2-digit" };
    } else if (value.getMonth() !== 0) {
      formatOptions = { month: "long" };
    } else {
      formatOptions = { year: "numeric" };
    }
    formatOptions.hour12 = false;
    formatOptions.timeZone = "UTC";
    const string = new Intl.DateTimeFormat("en-US", formatOptions).format(
      value
    );
    console.log(value, string);
    return string;
  }
}
