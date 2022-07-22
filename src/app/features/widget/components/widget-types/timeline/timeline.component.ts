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
import { Channel } from "@core/models/channel";
import { Metric } from "@core/models/metric";
import { DateService } from "@core/services/date.service";
import { ViewService } from "@core/services/view.service";
import { Measurement } from "@features/widget/models/measurement";
import { Threshold } from "@features/widget/models/threshold";
import { Subscription } from "rxjs";
import { EChartsOption, graphic } from "echarts";
import { WidgetTypeComponent } from "../widget-type.component";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { WidgetConnectService } from "@features/widget/services/widget-connect.service";

@Component({
  selector: "widget-timeline",
  templateUrl: "../e-chart.component.html",
  styleUrls: ["../e-chart.component.scss"],
  providers: [WidgetTypeService],
})
export class TimelineComponent
  implements OnInit, OnChanges, WidgetTypeComponent, OnDestroy
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
  // Max allowable time between measurements to connect
  maxMeasurementGap: number = 1 * 1000;
  test = 0;
  echartsInstance;
  lastEmphasis;
  xAxisLabels = [];

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (
      (changes.channels || changes.data) &&
      this.channels?.length > 0 &&
      this.selectedMetrics.length > 0
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
      tooltip: {
        formatter: (params) => {
          return this.widgetTypeService.timeAxisFormatToolTip(params);
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
      series: [],
    };

    this.options = this.widgetTypeService.chartOptions(chartOptions);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.echartsInstance = null;
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
      const defaultSeries = {
        large: true,
        encode: {
          x: 0,
          y: 3,
        },
        emphasis: {
          focus: "series",
          itemStyle: {
            borderWidth: 1,
          },
        },
      };

      let displayType;
      this.xAxisLabels = [];

      this.channels.sort((chanA, chanB) => {
        return chanA.nslc.localeCompare(chanB.nslc);
      });

      this.channels.forEach((channel, index) => {
        const nslc = channel.nslc.toUpperCase();
        this.selectedMetrics.forEach((metric) => {
          if (!this.metricSeries[metric.id]) {
            this.metricSeries[metric.id] = {
              series: [],
              yAxisLabels: [],
            };
          }

          if (data[channel.id] && data[channel.id][metric.id]) {
            let series;
            switch (this.properties.displayType) {
              case "hour":
                series = this.makeSeriesForFixed(
                  nslc,
                  data[channel.id][metric.id],
                  index,
                  "hour"
                );
                break;
              case "day":
                series = this.makeSeriesForFixed(
                  nslc,
                  data[channel.id][metric.id],
                  index,
                  "day"
                );
                break;
              default:
                series = this.makeSeriesForRaw(
                  nslc,
                  data[channel.id][metric.id],
                  index
                );
                break;
            }

            const channelObj = {
              ...defaultSeries,
              ...series,
            };
            this.metricSeries[metric.id].series.push(channelObj);
          }

          this.metricSeries[metric.id].yAxisLabels.push(nslc);
        });
      });
      resolve();
    });
  }

  makeSeriesForFixed(nslc, data, index, width) {
    const channelObj = {
      type: "heatmap",
      name: nslc,
      data: [],
    };

    let start;
    let count = 0;
    let total = 0;
    //trusts that measurements are in order of time
    data.forEach((measurement: Measurement, mIndex: number) => {
      if (!start) {
        start = this.dateService.parseUtc(measurement.starttime).startOf(width);
      }

      const measurementStart = this.dateService.parseUtc(measurement.starttime);

      // if next day/hour, end last time segment and start new one
      if (
        !measurementStart.isSame(start, width) ||
        mIndex === data.length - 1
      ) {
        //   .toDate();
        const avg = total / count;
        let startString;
        if (width === "day") {
          startString = start.startOf(width).utc().format("MMM DD");
        } else {
          startString = start.startOf(width).utc().format("MMM DD HH:00");
        }

        if (this.xAxisLabels.indexOf(startString) === -1) {
          this.xAxisLabels.push(startString);
        }

        channelObj.data.push({
          name: nslc,
          value: [startString, count, avg, index],
        });

        total = 0;
        count = 0;
        start = this.dateService.parseUtc(measurement.starttime).startOf(width);
      }

      count += 1;
      total += measurement.value;
    });

    return channelObj;
  }

  makeSeriesForRaw(nslc, data, index) {
    const channelObj = {
      type: "custom",
      name: nslc,
      data: [],
      renderItem: this.renderItem,
    };

    data.forEach((measurement: Measurement) => {
      const start = this.dateService.parseUtc(measurement.starttime).toDate();
      const end = this.dateService.parseUtc(measurement.endtime).toDate();
      channelObj.data.push({
        name: nslc,
        value: [start, end, measurement.value, index],
      });
    });

    return channelObj;
  }

  changeMetrics() {
    const displayMetric = this.selectedMetrics[0];
    const colorMetric = this.selectedMetrics[0];
    const visualMap = this.visualMaps[colorMetric.id];
    this.loadingChange.emit(false);

    const options = {
      yAxis: {
        data: this.metricSeries[displayMetric.id].yAxisLabels,
      },
      series: this.metricSeries[displayMetric.id].series,
      visualMap: visualMap,
      title: { text: `${displayMetric.name} (${displayMetric.unit})` },
    };
    if (
      this.properties.displayType === "hour" ||
      this.properties.displayType === "day"
    ) {
      this.updateOptions = {
        ...options,
        xAxis: {
          type: "category",
          name: "Measurement Start",
          axisPointer: {
            show: "true",
          },

          data: this.xAxisLabels,
        },
      };
    } else {
      this.updateOptions = {
        ...options,
        xAxis: {
          type: "time",
          name: "Measurement Start",
          min: this.viewService.startTime,
          max: this.viewService.endTime,
          axisLabel: {
            formatter: this.widgetTypeService.timeAxisTickFormatting,
          },
          axisPointer: {
            show: "true",
            label: {
              formatter: this.widgetTypeService.timeAxisPointerLabelFormatting,
            },
          },
        },
      };
    }
  }

  renderItem(params, api) {
    const categoryIndex = api.value(3);
    const start = api.coord([api.value(0), categoryIndex]); //converts to xy coords
    const end = api.coord([api.value(1), categoryIndex]); //converts to xy coords
    const height = api.size([0, 1])[1] * 1;
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
        focus: "series",
        blur: {
          style: {
            opacity: 0.7,
          },
        },
        shape: {
          x: start[0],
          y: start[1] - height / 2,
          width: end[0] - start[0],
          height: height,
        },
        style: api.style(),
      }
    );
  }
}
