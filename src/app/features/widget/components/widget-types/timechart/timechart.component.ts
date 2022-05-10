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
import * as dayjs from "dayjs";
import { Subscription } from "rxjs";

@Component({
  selector: "widget-timechart",
  templateUrl: "./timechart.component.html",
  styleUrls: ["./timechart.component.scss"],
})
export class TimechartComponent implements OnInit, OnChanges {
  constructor(
    private viewService: ViewService,
    private dateService: DateService
  ) {}
  @Input() widget: Widget;
  @Input() data;
  metrics: Metric[];
  thresholds: { [metricId: number]: Threshold };
  channelGroup: ChannelGroup;

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
      this.buildChartData(this.data);
      console.log("data changed");
    }
  }
  ngOnInit(): void {
    this.metrics = this.widget.metrics;
    this.thresholds = this.widget.thresholds;
    this.channelGroup = this.widget.channelGroup;
    this.currentMetric = this.metrics[0];
    this.referenceLines = [];
    if (this.channelGroup) {
      this.channels = this.channelGroup.channels;
    }
    const pieces = this.addThresholds();
    const legendOffset = pieces.length;
    this.buildChartData(this.data);
    this.options = {
      title: {
        text: this.currentMetric.name,
        subtext: "sub text",
      },
      legend: {
        show: true,
        type: "scroll",
        orient: "vertical",
        align: "left",
        left: "right",
        top: legendOffset * 15,
      },
      grid: {
        containLabel: true,
        left: "30",
        right: "15%",
        bottom: "30",
      },
      useUtc: true,
      xAxis: {
        type: "time",
        nameLocation: "center",
        nameGap: 30,
        axisTick: {
          interval: 0,
        },
        axisPointer: {
          show: "true",
          label: {
            formatter: (value) => {
              return this.xAxisTooltipLabelFormatting(value.value);
            },
          },
        },
        axisLabel: {
          formatter: this.xAxisTickFormatting,
        },
      },
      yAxis: {
        type: "value",
        nameLocation: "center",
        nameTextStyle: {
          verticalAlign: "bottom",
          align: "middle",
        },
        nameGap: 40, //max characters
      },
      tooltip: {
        trigger: "item",
        position: function (pt) {
          return [pt[0], "10%"];
        },
      },
      visualMap: {
        top: 0,
        right: 0,
        type: "piecewise",
        pieces: pieces,
        outOfRange: {
          color: "#999",
        },
      },
      dataZoom: [],
      series: [],
    };
  }

  addThresholds(): Array<any> {
    const pieces = [];
    if (this.thresholds[this.currentMetric.id]) {
      const piece = {};
      // thresholds.forEach((threshold)=>{  }) //allow multople
      const threshold = this.thresholds[this.currentMetric.id];
      if (threshold.min || threshold.min === 0) {
        piece["min"] = threshold.min;
      }
      if (threshold.max || threshold.max === 0) {
        piece["max"] = threshold.max;
      }
      piece["color"] = "#AA069F";
      pieces.push(piece);
    }

    return pieces;
  }

  buildChartData(data) {
    let max;
    let min;

    this.results = [];

    // this.addThresholds();
    this.xAxisLabel = "Measurement Time";
    this.yAxisLabel = this.currentMetric ? this.currentMetric.unit : "Unknown";
    this.channels.forEach((channel) => {
      const channelObj = {
        name: channel.nslc,
        type: "line",
        data: [],
        large: true,
      };

      if (data[channel.id] && data[channel.id][this.currentMetric.id]) {
        let lastEnd: dayjs.Dayjs;
        data[channel.id][this.currentMetric.id].forEach(
          (measurement: Measurement) => {
            if (!min || !max) {
              min = measurement.value;
              max = measurement.value;
            } else if (measurement.value > max) {
              max = measurement.value;
            } else if (measurement.value < min) {
              min = measurement.value;
            }

            // // If time between measurements is greater than gap, don't connect
            if (channelObj.data.length > 0 && lastEnd) {
              // time since last measurement
              const start = this.dateService.parseUtc(measurement.starttime);

              const diff = this.dateService.diff(start, lastEnd);

              if (
                diff >=
                this.currentMetric.sampleRate * this.maxMeasurementGap
              ) {
                this.results.push({
                  name: channelObj.name,
                  type: "line",
                  data: channelObj.data,
                  large: true,
                });
                channelObj.data = [];
              }
            }
            let start = this.dateService
              .parseUtc(measurement.starttime)
              .toDate();
            // let start = measurement.starttime;
            channelObj.data.push([start, measurement.value]);

            // meas end
            // channelObj.data.push([measurement.endtime, measurement.value]);

            lastEnd = this.dateService.parseUtc(measurement.endtime);
          }
        );
        this.hasData = !this.hasData
          ? data[channel.id][this.currentMetric.id].length > 0
          : this.hasData;
      }

      if (channelObj.data.length > 0) {
        this.results.push(channelObj);
      }
    });

    //yaxis label placement

    this.yScaleMax = Math.round(max) + 25;
    this.yScaleMin = Math.round(min) - 25;

    this.viewService.startdate;
    this.viewService.enddate;
    this.updateOptions = {
      series: this.results,
      useUtc: true,
      xAxis: {
        name: this.xAxisLabel,
        min: this.viewService.startdate,
        max: this.viewService.enddate,
      },
      yAxis: {
        name: this.yAxisLabel,
        nameGap: this.yAxisLabelPosition(min, max),
      },
    };
  }
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
    return string;
  }
}
