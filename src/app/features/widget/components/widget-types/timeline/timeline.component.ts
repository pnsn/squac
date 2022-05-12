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
  @Input() selectedMetric: Metric;
  @Input() dataRange: any;

  subscription = new Subscription();
  results: Array<any>;
  options = {};
  updateOptions = {};
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
    //selectedMetric change
    //
    //channels Change
  }
  ngOnInit(): void {
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
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            show: true, //not resetting correctlys
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
        nameLocation: "center",
        nameTextStyle: {
          verticalAlign: "bottom",
          align: "middle",
        },
        nameGap: 40, //max characters
      },
      tooltip: {
        confine: true,
        trigger: "item",
        position: function (pt) {
          return [pt[0], "10%"];
        },
        formatter: (params) => {
          return this.widgetTypeService.timeAxisFormatToolTip(params);
        },
        axisPointer: {
          type: "cross",
        },
      },
      dataZoom: [
        {
          type: "inside",
          moveOnMouseWheel: true,
          zoomOnMouseWheel: false,
          orient: "vertical",
        },
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

  onChartEvent(event, type) {
    console.log(event, type);
  }

  buildChartData(data) {
    const metricSeries = {};
    const visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
      this.metrics,
      this.thresholds,
      this.dataRange,
      3
    );
    this.channels.forEach((channel, index) => {
      this.metrics.forEach((metric, i) => {
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
        if (data[channel.id] && data[channel.id][this.selectedMetric.id]) {
          data[channel.id][this.selectedMetric.id].forEach(
            (measurement: Measurement) => {
              const start = this.dateService
                .parseUtc(measurement.starttime)
                .toDate();
              const end = this.dateService
                .parseUtc(measurement.endtime)
                .toDate();
              channelObj.data.push({
                name: channel.nslc,
                value: [index, start, end, measurement.value],
              });
            }
          );
        }

        if (!metricSeries[metric.id]) {
          metricSeries[metric.id] = {
            series: [],
            yAxisLabels: [],
          };
        }
        metricSeries[metric.id].series.push(channelObj);
        metricSeries[metric.id].yAxisLabels.push(channel.nslc);
      });
    });

    this.updateOptions = {
      series: metricSeries[this.selectedMetric.id].series,
      visualMap: visualMaps[this.selectedMetric.id],
      yAxis: {
        data: metricSeries[this.selectedMetric.id].yAxisLabels,
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
