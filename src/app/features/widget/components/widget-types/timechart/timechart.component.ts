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
import { WidgetConnectService } from "@features/widget/services/widget-connect.service";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import * as dayjs from "dayjs";
import { Subscription, throwIfEmpty } from "rxjs";
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
    private widgetTypeService: WidgetTypeService,
    private widgetConnectService: WidgetConnectService
  ) {}
  @Input() data;
  @Input() metrics: Metric[];
  @Input() thresholds: Threshold[];
  @Input() channels: Channel[];
  @Input() properties: any[];
  @Input() dataRange: any;
  @Input() selectedMetrics: Metric[];
  @Input() showStationList: boolean;
  @Input() loading: string | boolean;
  @Output() loadingChange = new EventEmitter();
  emphasizedChannel: string;
  deemphasizedChannel: string;
  echartsInstance;
  subscription = new Subscription();
  options: any = {};
  updateOptions: any = {};
  initOptions: any = {};
  metricSeries: any = {};
  visualMaps = {};
  lastEmphasis;
  // Max allowable time between measurements to connect
  maxMeasurementGap = 1.5;

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.properties) {
      this.getVisualMaps();
    }
    if (
      (changes.channels || changes.data) &&
      this.channels.length > 0 &&
      this.selectedMetrics.length > 0
    ) {
      this.buildChartData(this.data).then(() => {
        this.changeMetrics();
      });
    }
    if (changes.showStationList) {
      this.toggleStationList();
    }
  }
  ngOnInit(): void {
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
    const chartOptions: any = {
      yAxis: {
        type: "value",
      },
      xAxis: {
        type: "time",
        name: "Measurement Start",

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
        },
        grid: {
          right: 75,
        },
      };
    } else {
      temp = {
        legend: {
          show: false,
        },
        grid: {
          right: 5,
        },
      };
    }
    this.updateOptions = { ...this.updateOptions, ...temp };
  }

  onChartEvent(event, type) {
    console.log(event, type);
  }

  onChartInit(event) {
    this.echartsInstance = event;
  }

  startZoom() {
    if (this.echartsInstance) {
      this.echartsInstance.dispatchAction({
        type: "takeGlobalCursor",
        key: "dataZoomSelect",
        // Activate or inactivate.
        dataZoomSelectActive: true,
      });
    }
  }

  emphasizeChannel(channel) {
    if (this.echartsInstance) {
      this.echartsInstance.dispatchAction({
        type: "highlight",
        seriesId: channel,
      });
    }
  }

  deemphasizeChannel(channel) {
    if (this.echartsInstance) {
      this.echartsInstance.dispatchAction({
        type: "downplay",
        seriesId: channel,
      });
    }
  }

  getVisualMaps() {
    this.visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
      this.selectedMetrics,
      this.thresholds,
      this.properties,
      this.dataRange,
      2
    );
  }

  buildChartData(data) {
    this.loadingChange.emit("Building chart...");
    return new Promise<void>((resolve) => {
      const stations = [];
      this.metricSeries = {};
      const series = {
        type: "line",
        large: true,
        largeThreshold: 1000,
        legendHoverLink: true,
        lineStyle: {
          width: 1,
          opacity: 1,
        },
        emphasis: {
          focus: "series",
        },

        symbol: "circle",
        symbolSize: 2,
        sampling: "lttb",
      };
      // this.addThresholds();

      const metric = this.selectedMetrics[0];
      this.channels.forEach((channel) => {
        const staCode = channel.networkCode + "." + channel.stationCode;
        const nslc = channel.nslc.toUpperCase();
        const station = {
          ...series,
          ...{
            name: nslc,
            id: nslc,
            data: [],
            count: 0,
            encode: {
              x: [0, 1],
              y: 2,
            },
          },
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
                name: nslc,
                value: [lastEnd.toDate(), start.toDate(), "-"],
              });
            }

            station.data.push({
              name: nslc,
              value: [start.toDate(), end.toDate(), measurement.value],
            });

            lastEnd = end;
          });
        }
        stations.push(station);
      });
      this.metricSeries.series = stations;
      resolve();
    });
  }

  changeMetrics() {
    const displayMetric = this.selectedMetrics[0];
    const colorMetric = this.selectedMetrics[0];
    const visualMap = this.visualMaps[colorMetric.id];

    this.updateOptions = {
      series: this.metricSeries.series,
      title: {
        text: `${displayMetric.name} (${displayMetric.unit})`,
      },
      visualMap,
      xAxis: {
        min: this.viewService.startTime,
        max: this.viewService.endTime,
        axisLabel: {},
      },
    };

    if (this.echartsInstance) {
      this.echartsInstance.setOption(this.updateOptions, {
        replaceMerge: ["series"],
      });
    }
    //
    this.loadingChange.emit(false);
  }
}
