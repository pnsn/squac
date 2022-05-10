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
import * as dayjs from "dayjs";
import { Subscription } from "rxjs";
import { graphic } from "echarts";
import { WidgetTypeComponent } from "../widget-type.component";

@Component({
  selector: "widget-timeline",
  templateUrl: "../e-chart.component.html",
  styleUrls: ["../e-chart.component.scss"],
})
export class TimelineComponent
  implements OnInit, OnChanges, WidgetTypeComponent
{
  constructor(
    private viewService: ViewService,
    private dateService: DateService
  ) {}
  @Input() data;
  @Input() metrics: Metric[];
  @Input() channelGroup: ChannelGroup;
  @Input() thresholds: { [metricId: number]: Threshold };
  @Input() channels: Channel[];

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
    this.currentMetric = this.metrics[0];
    this.referenceLines = [];
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
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            show: true,
          },
        },
      },
      grid: {
        containLabel: true,
        left: "40",
        // right: "80",
        // bottom: "80",
      },
      useUtc: true,
      xAxis: {
        type: "time",
        nameLocation: "center",
        name: "Measurement Start Date",
        min: this.viewService.startdate,
        max: this.viewService.enddate,
        nameGap: 30,
        axisTick: {
          interval: 0,
        },
        axisLabel: {
          formatter: this.xAxisTickFormatting,
        },
        axisPointer: {
          show: "true",
          label: {
            formatter: (value) => {
              return this.xAxisTooltipLabelFormatting(value.value);
            },
          },
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
      visualMap: {
        top: 0,
        right: 0,
        type: "piecewise",
        dimension: 3,
        pieces: pieces,
        outOfRange: {
          color: "#999",
        },
      },
      tooltip: {
        trigger: "item",
        position: function (pt) {
          return [pt[0], "10%"];
        },
        formatter: (params) => {
          return this.formatToolTip(params);
        },
        axisPointer: {
          type: "cross",
        },
      },
      dataZoom: [
        {
          type: "slider",
          realtime: true,
          orient: "horizontal",
        },
        {
          type: "slider",
          realtime: true,
          orient: "vertical",
          left: "left",
          showDetail: false,
        },
      ],
      series: [],
    };
  }

  formatToolTip(params) {
    let data = [];
    if (Array.isArray(params)) {
      data = [...params];
    } else {
      data.push(params);
    }
    let str = "";

    if (data[0].axisValueLabel) {
      str += data[0].axisValueLabel;
    } else {
      str += this.xAxisTooltipLabelFormatting(data[0].value[1]);
    }

    str += "<br />";
    data.forEach((param) => {
      str += param.marker + " " + param.name + " " + param.value[3] + "<br />";
    });

    return str;
  }

  addThresholds(): Array<any> {
    const pieces = [
      {
        min: 99,
        max: 100,
        color: "#AA069F",
      },
    ];
    // if (this.thresholds[this.currentMetric.id]) {
    //   const piece = {};
    //   // thresholds.forEach((threshold)=>{  }) //allow multople
    //   const threshold = this.thresholds[this.currentMetric.id];
    //   if (threshold.min || threshold.min === 0) {
    //     piece["min"] = threshold.min;
    //   }
    //   if (threshold.max || threshold.max === 0) {
    //     piece["max"] = threshold.max;
    //   }
    //   piece["color"] = "#AA069F";
    //   pieces.push(piece);
    // }

    return pieces;
  }

  buildChartData(data) {
    let max;
    let min;

    this.results = [];
    // this.addThresholds();
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

    this.channels.sort((a, b) => {
      return b.nslc.localeCompare(a.nslc);
    });
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
              name: channel.nslc,
              value: [index, start, end, measurement.value],
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
    this.yScaleMax = Math.round(max) + 25;
    this.yScaleMin = Math.round(min) - 25;

    this.updateOptions = {
      series: series,
      useUtc: true,
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
