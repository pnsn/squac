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
import { Subscription } from "rxjs";
import { EChartsOption, graphic } from "echarts";
import { WidgetTypeComponent } from "../widget-type.component";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";

@Component({
  selector: "widget-timeline",
  templateUrl: "../e-chart.component.html",
  styleUrls: ["../e-chart.component.scss"],
  providers: [WidgetTypeService],
})
export class TimelineComponent
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
  @Input() selectedMetrics: Metric[];
  @Input() dataRange: any;

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
    //override defaults
    const chartOptions = {
      tooltip: {
        formatter: (params) => {
          return this.widgetTypeService.timeAxisFormatToolTip(params);
        },
      },
      xAxis: {
        type: "time",
        name: "Measurement Start",
        axisTick: {
          interval: 0,
        },
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
      yAxis: {
        inverse: "true",
        type: "category",
        nameGap: 40, //max characters
      },
      series: [],
    };

    this.options = this.widgetTypeService.chartOptions(chartOptions);
  }

  onChartEvent(event, type) {
    console.log(event, type);
  }

  buildChartData(data) {
    this.metricSeries = {};
    this.visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
      this.metrics,
      this.thresholds,
      this.dataRange,
      3
    );
    this.channels.forEach((channel, index) => {
      this.metrics.forEach((metric) => {
        const channelObj = {
          type: "custom",
          name: channel.nslc,
          data: [],
          large: true,
          encode: {
            x: [1, 2],
            y: 0,
          },
          renderItem: this.renderItem,
        };
        if (data[channel.id] && data[channel.id][metric.id]) {
          data[channel.id][metric.id].forEach((measurement: Measurement) => {
            const start = this.dateService
              .parseUtc(measurement.starttime)
              .toDate();
            const end = this.dateService.parseUtc(measurement.endtime).toDate();
            channelObj.data.push({
              name: channel.nslc,
              value: [index, start, end, measurement.value],
            });
          });
        }

        if (!this.metricSeries[metric.id]) {
          this.metricSeries[metric.id] = {
            series: [],
            yAxisLabels: [],
          };
        }
        this.metricSeries[metric.id].series.push(channelObj);
        this.metricSeries[metric.id].yAxisLabels.push(channel.nslc);
      });
    });
  }

  changeMetrics() {
    const selectedMetric = this.selectedMetrics[0];
    this.updateOptions = {
      series: this.metricSeries[selectedMetric.id].series,
      visualMap: this.visualMaps[selectedMetric.id],
      xAxis: {
        min: this.viewService.startTime,
        max: this.viewService.endTime,
      },
      yAxis: {
        data: this.metricSeries[selectedMetric.id].yAxisLabels,
      },
    };
  }

  renderItem(params, api) {
    const categoryIndex = api.value(0);
    const start = api.coord([api.value(1), categoryIndex]); //converts to xy coords
    const end = api.coord([api.value(2), categoryIndex]); //converts to xy coords
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
  }
}
