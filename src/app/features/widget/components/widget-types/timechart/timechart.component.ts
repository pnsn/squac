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
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import * as dayjs from "dayjs";
import { Subscription } from "rxjs";
import { WidgetTypeComponent } from "../widget-type.component";

@Component({
  selector: "widget-timechart",
  templateUrl: "../e-chart.component.html",
  styleUrls: ["../e-chart.component.scss"],
  providers: [WidgetTypeService],
})
export class TimechartComponent
  implements OnInit, OnChanges, WidgetTypeComponent
{
  constructor(
    private viewService: ViewService,
    private dateService: DateService,
    private widgetTypeService: WidgetTypeService
  ) {}
  @Input() data;
  @Input() metrics: Metric[];
  @Input() channelGroup: ChannelGroup;
  @Input() thresholds: { [metricId: number]: Threshold };
  @Input() channels: Channel[];
  @Input() selectedMetric: Metric;
  @Input() dataRange: any;

  subscription = new Subscription();
  options = {};
  updateOptions = {};
  initOptions = {};

  // Max allowable time between measurements to connect
  maxMeasurementGap: number = 1 * 1000;

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.data && this.channels.length > 0) {
      this.buildChartData(this.data);
      console.log("data changed");
    }
  }
  ngOnInit(): void {
    this.selectedMetric = this.metrics[0];
    const pieces = [
      {
        min: 0,
        max: 40,
      },
    ];
    const legendOffset = pieces.length;
    // this.buildChartData(this.data);
    this.options = {
      title: {
        text: this.selectedMetric.name,
        subtext: "sub text",
      },
      animation: false,
      legend: {
        show: false,
        type: "scroll",
        orient: "vertical",
        align: "left",
        left: "right",
        top: legendOffset * 15 + 5,
        selector: ["all", "inverse"],
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
        name: "Measurement Start Date",
        nameLocation: "center",
        nameGap: 30,
        axisTick: {
          interval: 0,
        },
        axisPointer: {
          show: "true",
          label: {
            formatter: this.widgetTypeService.timeAxisPointerLabelFormatting,
          },
        },
        axisLabel: {
          formatter: this.widgetTypeService.timeAxisTickFormatting,
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
      tooltip: {
        confine: true,
        trigger: "item",
        axisPointer: {
          type: "cross",
        },
        position: function (pt) {
          return [pt[0], "10%"];
        },
        formatter: (params) => {
          return this.widgetTypeService.timeAxisFormatToolTip(params);
        },
      },
      series: [],
    };
  }

  onChartEvent(event, type) {
    console.log(event, type);
  }

  buildChartData(data) {
    const metricSeries = {};
    // this.addThresholds();
    const visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
      this.metrics,
      this.thresholds,
      this.dataRange,
      3
    );

    this.channels.forEach((channel) => {
      this.metrics.forEach((metric, i) => {
        if (!metricSeries[metric.id]) {
          metricSeries[metric.id] = {
            series: [],
          };
        }
        const channelObj = {
          name: channel.nslc,
          type: "line",
          data: [],
          large: true,
          step: "start",
          symbol: "circle",
          sampling: "lttb",
          encode: {
            x: [1, 2],
            y: 3,
          },
        };
        let lastEnd: dayjs.Dayjs;
        if (data[channel.id] && data[channel.id][metric.id]) {
          data[channel.id][metric.id].forEach((measurement: Measurement) => {
            // // If time between measurements is greater than gap, don't connect
            const start = this.dateService.parseUtc(measurement.starttime);
            const end = this.dateService.parseUtc(measurement.endtime);

            if (
              channelObj.data.length > 0 &&
              lastEnd &&
              this.dateService.diff(start, lastEnd) >=
                this.selectedMetric.sampleRate * this.maxMeasurementGap
            ) {
              // time since last measurement
              channelObj.data.push([
                channelObj.name,
                lastEnd.toDate(),
                "start.toDate()",
                "-",
              ]);
            }

            // let start = measurement.starttime;
            channelObj.data.push([
              channelObj.name,
              start.toDate(),
              end.toDate(),
              measurement.value,
            ]);
            // let start = measurement.starttime;
            channelObj.data.push([
              channelObj.name,
              end.toDate(),
              "-",
              measurement.value,
            ]);

            lastEnd = end;
          });
        }
        metricSeries[metric.id].series.push(channelObj);
      });
    });

    this.updateOptions = {
      series: metricSeries[this.selectedMetric.id].series,
      visualMap: visualMaps[this.selectedMetric.id],
      xAxis: {
        min: this.viewService.startdate,
        max: this.viewService.enddate,
      },
      yAxis: {
        name: this.selectedMetric ? this.selectedMetric.unit : "Unknown",
        nameGap: this.widgetTypeService.yAxisLabelPosition(
          this.dataRange[this.selectedMetric.id].min,
          this.dataRange[this.selectedMetric.id].max
        ),
      },
    };
  }
}
