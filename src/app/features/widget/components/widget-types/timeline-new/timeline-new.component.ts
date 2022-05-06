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
import { Measurement } from "@features/widget/models/measurement";
import { Threshold } from "@features/widget/models/threshold";
import { Widget } from "@features/widget/models/widget";
import * as dayjs from "dayjs";
import { Subscription } from "rxjs";
import { graphic } from "echarts";

@Component({
  selector: "widget-timeline-new",
  templateUrl: "./timeline-new.component.html",
  styleUrls: ["./timeline-new.component.scss"],
})
export class TimelineNewComponent implements OnInit, OnChanges {
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
        right: "30",
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
        type: "category",
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
      dataZoom: [
        {
          type: "inside",
          filterMode: "weakFilter",
          orient: "vertical",
        },
        {
          type: "slider",
        },
      ],
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
    const yAxisLabels = [];
    const series = {
      type: "custom",
      data: [],
      large: true,
      itemStyle: {
        opacity: 0.8,
      },
      encode: {
        x: [1, 2],
        y: 0,
      },
      renderItem: (params, api) => {
        const categoryIndex = api.value(0);
        const start = api.coord([api.value(1), categoryIndex]);
        const end = api.coord([api.value(2), categoryIndex]);
        const height = api.size([0, 1])[1] * 0.6;
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
        console.log({
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height,
        });
        return (
          rectShape && {
            type: "rect",
            transition: ["shape"],
            shape: {
              x: start[0],
              y: start[1] - height / 2,
              width: end[0] - start[0],
              height: height,
            },
            style: api.style(),
          }
        );
      },
    };

    this.channels.forEach((channel) => {
      if (data[channel.id] && data[channel.id][this.currentMetric.id]) {
        const index = yAxisLabels.length;
        yAxisLabels.push(channel.nslc);

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

            const start = this.dateService
              .parseUtc(measurement.starttime)
              .toDate();
            const end = this.dateService.parseUtc(measurement.endtime).toDate();
            // let start = measurement.starttime;
            series.data.push({
              name: measurement.value > 100 ? "In Spec" : "Out of Spec",
              value: [index, start, end, measurement.value],
              itemStyle: {
                normal: {
                  color: measurement.value > 100 ? "#7b9ce1" : "#e0bc78",
                },
              },
            });
          }
        );
        // console.log(channelObj);
        this.hasData = !this.hasData
          ? data[channel.id][this.currentMetric.id].length > 0
          : this.hasData;
      }

      // if (channelObj.data.length > 0) {
      //   this.results.push(channelObj);
      // }
    });

    console.log(yAxisLabels);
    this.yScaleMax = Math.round(max) + 25;
    this.yScaleMin = Math.round(min) - 25;

    this.viewService.startdate;
    this.viewService.enddate;
    this.updateOptions = {
      series: series,
      useUtc: true,
      xAxis: {
        name: this.xAxisLabel,
        min: this.viewService.startdate,
        max: this.viewService.enddate,
      },
      yAxis: {
        data: yAxisLabels,
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
      //have to reassign it this way or linter won't allow it
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
