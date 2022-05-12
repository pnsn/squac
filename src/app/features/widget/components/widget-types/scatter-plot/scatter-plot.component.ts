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
import { Threshold } from "@features/widget/models/threshold";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { DimensionsHelper } from "@swimlane/ngx-datatable";
import { Subscription } from "rxjs";
import { WidgetTypeComponent } from "../widget-type.component";

@Component({
  selector: "widget-scatter-plot",
  templateUrl: "../e-chart.component.html",
  styleUrls: ["../e-chart.component.scss"],
  providers: [WidgetTypeService],
})
export class ScatterPlotComponent
  implements OnInit, WidgetTypeComponent, OnChanges
{
  @Input() data;
  @Input() metrics: Metric[];
  @Input() channelGroup: ChannelGroup;
  @Input() thresholds: { [metricId: number]: Threshold };
  @Input() channels: Channel[];
  @Input() dataRange: any;
  schema = [];
  subscription = new Subscription();
  results: Array<any>;
  options = {};
  updateOptions = {};
  initOptions = {};
  constructor(private widgetTypeService: WidgetTypeService) {}
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.data && this.channels.length > 0) {
      this.buildRows(this.data);
    }
  }
  ngOnInit(): void {
    this.options = {
      grid: {
        containLabel: true,
        left: "40",
      },
      useUtc: true,

      animation: false,
      xAxis: {
        nameLocation: "center",
        nameGap: 30,
      },
      yAxis: {
        nameLocation: "center",
        nameTextStyle: {
          verticalAlign: "bottom",
          align: "middle",
        },
      },
      dataZoom: [],
      series: [],
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "cross",
        },
        position: function (pt) {
          return [pt[0], "10%"];
        },
        confine: true,
        formatter: this.widgetTypeService.multiMetricTooltipFormatting,
      },
    };
  }
  toggleLegend() {}

  onChartEvent(event, type) {
    console.log(event.seriesName, type);
  }

  private buildRows(data) {
    //if 3 metrics, visualMap
    const metricSeries = {
      type: "scatter",
      colorBy: "data", //unless visualMap
      data: [],
      large: true,
      dimensions: [],
    };

    const visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
      this.metrics,
      this.thresholds,
      this.dataRange,
      2
    );

    const processedData = this.widgetTypeService.getSeriesForMultipleMetrics(
      this.metrics,
      this.channels,
      data,
      metricSeries
    );
    const visualMap = visualMaps[this.metrics[2].id];

    this.updateOptions = {
      series: processedData.series,
      xAxis: {
        name: this.metrics[0].name,
      },
      visualMap,
      yAxis: {
        name: this.metrics[1].name,
        nameGap: this.widgetTypeService.yAxisLabelPosition(
          this.dataRange[this.metrics[0].id].min,
          this.dataRange[this.metrics[0].id].max
        ),
      },
    };
  }
}
