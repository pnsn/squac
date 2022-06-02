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
  @Input() properties: any[];
  @Input() dataRange: any;
  @Input() selectedMetrics: Metric[];
  @Input() showStationList: boolean;
  subscription = new Subscription();
  options: any = {};
  updateOptions: any = {};
  initOptions: any = {};
  metricSeries: any = {};
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
    if (changes.showStationList) {
      this.toggleStationList();
    }
  }
  ngOnInit(): void {
    const chartOptions: any = {
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

  toggleStationList() {
    let temp: any = {};
    if (this.showStationList) {
      temp = {
        legend: {
          show: true,
          right: 5,
        },
        grid: {
          right: 65,
        },
      };
    } else {
      temp = {
        legend: {
          show: false,
        },
        grid: {
          right: 20,
        },
      };
    }
    this.updateOptions = { ...this.updateOptions, ...temp };
  }

  onChartEvent(event, type) {
    console.log(event, type);
  }

  buildChartData(data) {
    const stationLookup: any = {};
    const stations = [];
    this.metricSeries = {};
    const series = {
      type: "line",
      large: true,
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: false,
        },
        focus: "series",
        lineStyle: {
          width: 2,
        },
      },
      symbol: "circle",
      symbolSize: 3,
      sampling: "lttb",
    };
    // this.addThresholds();
    this.visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
      this.selectedMetrics,
      this.thresholds,
      this.properties,
      this.dataRange,
      2
    );
    const metric = this.selectedMetrics[0];

    this.channels.forEach((channel) => {
      const staCode = channel.networkCode + "." + channel.stationCode;
      if (!stationLookup[staCode]) {
        stationLookup[staCode] = stations.length;
        stations.push({
          ...series,
          name: staCode,
          data: [],
          encode: {
            x: [0, 1],
            y: 2,
          },
        });
      }
      const index = stationLookup[staCode];
      const station = stations[index];

      const chanData = {
        name: channel.nslc,
        groupId: channel.id,
        value: [],
      };

      let lastEnd: dayjs.Dayjs;
      if (data[channel.id] && data[channel.id][metric.id]) {
        data[channel.id][metric.id].forEach((measurement: Measurement) => {
          // // If time between measurements is greater than gap, don't connect
          const start = this.dateService.parseUtc(measurement.starttime);
          const end = this.dateService.parseUtc(measurement.endtime);

          if (
            station.data.length > 0 &&
            lastEnd &&
            this.dateService.diff(start, lastEnd) >=
              metric.sampleRate * this.maxMeasurementGap
          ) {
            // time since last measurement
            station.data.push({
              name: channel.nslc,
              value: [lastEnd.toDate(), start.toDate(), null],
            });
          }

          station.data.push({
            name: channel.nslc,
            value: [start.toDate(), end.toDate(), measurement.value],
          });

          lastEnd = end;
        });

        // add datapoint at end to prevent different channel lines from connecting
        station.data.push({
          name: channel.nslc,
          value: [lastEnd.toDate(), "-", "-"],
        });
      }
    });
    this.metricSeries.series = stations;
    console.log(this.metricSeries.series);
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
      series: this.metricSeries.series,
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
