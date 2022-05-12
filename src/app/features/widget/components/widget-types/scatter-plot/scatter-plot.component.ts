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
  @Input() selectedMetrics: Metric[];
  schema = [];
  subscription = new Subscription();
  results: Array<any>;
  options = {};
  updateOptions = {};
  initOptions = {};
  visualMaps = {};
  processedData: any;
  constructor(private widgetTypeService: WidgetTypeService) {}
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
      series: [],
      grid: {
        left: 65,
      },
      tooltip: {
        formatter: this.widgetTypeService.multiMetricTooltipFormatting,
      },
    };

    this.options = this.widgetTypeService.chartOptions(chartOptions);
  }
  toggleLegend() {}

  onChartEvent(event, type) {
    console.log(event.seriesName, type);
  }

  private buildChartData(data) {
    //if 3 metrics, visualMap
    const metricSeries = {
      type: "scatter",
      colorBy: "data", //unless visualMap
      data: [],
      large: true,
      dimensions: [],
    };

    this.visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
      this.selectedMetrics,
      this.thresholds,
      this.dataRange,
      2
    );

    this.processedData = this.widgetTypeService.getSeriesForMultipleMetrics(
      this.selectedMetrics,
      this.channels,
      data,
      metricSeries
    );
  }

  changeMetrics() {
    console.log("Change metrics");
    const visualMap = this.visualMaps[this.selectedMetrics[2].id];

    this.updateOptions = {
      series: this.processedData.series,
      xAxis: {
        name: this.selectedMetrics[0].name,
      },
      visualMap,
      yAxis: {
        name: this.selectedMetrics[1].name,
        nameGap: this.widgetTypeService.yAxisLabelPosition(
          this.dataRange[this.selectedMetrics[0].id].min,
          this.dataRange[this.selectedMetrics[0].id].max
        ),
      },
    };
  }
}
