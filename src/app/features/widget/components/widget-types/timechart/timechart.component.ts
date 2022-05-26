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
  @Input() thresholds: Threshold[];
  @Input() channels: Channel[];

  @Input() dataRange: any;
  @Input() selectedMetrics: Metric[];
  subscription = new Subscription();
  options = {};
  updateOptions = {};
  initOptions = {};
  metricSeries = {};
  visualMaps = {};

  // Max allowable time between measurements to connect
  maxMeasurementGap: number = 1 * 1000;

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (
      (changes.data || changes.selectedMetrics) &&
      this.channels.length > 0 &&
      this.selectedMetrics.length > 0
    ) {
      this.buildChartData(this.data);
      this.changeMetrics();
    }
  }
  ngOnInit(): void {
    const chartOptions = {
      grid: {
        containLabel: true,
        left: 55,
      },
      xAxis: {
        type: "time",
        name: "Measurement Start",
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
      tooltip: {
        formatter: (params) => {
          return this.widgetTypeService.timeAxisFormatToolTip(params);
        },
      },
    };

    this.options = this.widgetTypeService.chartOptions(chartOptions);
  }

  onChartEvent(event, type) {
    console.log(event, type);
  }

  buildChartData(data) {
    this.metricSeries = {};
    // this.addThresholds();
    this.visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
      this.selectedMetrics,
      this.thresholds,
      this.dataRange,
      3
    );

    this.channels.forEach((channel) => {
      this.selectedMetrics.forEach((metric) => {
        if (!this.metricSeries[metric.id]) {
          this.metricSeries[metric.id] = {
            series: [],
          };
        }
        const channelObj = {
          name: channel.nslc,
          type: "line",
          data: [],
          large: true,
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: false,
              formatter: "{a}",
            },
            focus: "series",
            lineStyle: {
              width: 2,
            },
          },
          step: "start",
          symbol: "circle",
          symbolSize: 2,
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
                metric.sampleRate * this.maxMeasurementGap
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
        this.metricSeries[metric.id].series.push(channelObj);
      });
    });
  }

  changeMetrics() {
    const displayMetric = this.selectedMetrics[0];
    const colorMetric = this.selectedMetrics[0];
    let visualMap = this.visualMaps[colorMetric.id];
    if (!visualMap) {
      visualMap = this.widgetTypeService.getVisualMapFromMetric(
        colorMetric,
        this.dataRange,
        3
      );
    }
    this.updateOptions = {
      series: this.metricSeries[displayMetric.id].series,
      title: {
        text: displayMetric.name,
      },
      visualMap: this.visualMaps[colorMetric.id],
      xAxis: {
        min: this.viewService.startTime,
        max: this.viewService.endTime,
      },
      yAxis: {
        name: displayMetric ? displayMetric.unit : "Unknown",
      },
    };
  }
}
