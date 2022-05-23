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
import { Subscription } from "rxjs";
import { WidgetTypeComponent } from "../widget-type.component";

@Component({
  selector: "widget-parallel-plot",
  templateUrl: "../e-chart.component.html",
  styleUrls: ["../e-chart.component.scss"],
  providers: [WidgetTypeService],
})
export class ParallelPlotComponent
  implements OnInit, OnChanges, WidgetTypeComponent
{
  constructor(private widgetTypeService: WidgetTypeService) {}
  @Input() data;
  @Input() metrics: Metric[];
  @Input() channelGroup: ChannelGroup;
  @Input() thresholds: Threshold[];
  @Input() channels: Channel[];
  @Input() dataRange: any;
  @Input() selectedMetrics: Metric[];
  schema = [];
  subscription = new Subscription();
  results: Array<any>;
  options = {};
  updateOptions = {};
  initOptions = {};
  processedData;
  echartsInstance;
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
      parallel: {
        parallelAxisDefault: {
          nameTextStyle: {
            width: 15,
            overflow: "break",
          },
        },
      },
      xAxis: false,
      yAxis: false,
      tooltip: {
        formatter: this.widgetTypeService.multiMetricTooltipFormatting,
      },
      dataZoom: [],
    };
    this.options = this.widgetTypeService.chartOptions(chartOptions);
  }
  // toggleLegend() {}

  onChartEvent(event, type) {
    console.log(event.seriesName, type);
  }

  onChartInit(ec) {
    this.echartsInstance = ec;
  }

  private buildChartData(data) {
    const metricSeries = {
      type: "parallel",
      colorBy: "data",
      data: [],
      large: true,
      dimensions: [],
    };
    // const visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
    //   this.metrics,
    //   this.thresholds,
    //   this.dataRange
    // );
    this.processedData = this.widgetTypeService.getSeriesForMultipleMetrics(
      this.selectedMetrics,
      this.channels,
      data,
      metricSeries
    );
  }

  changeMetrics() {
    this.updateOptions = {
      series: this.processedData.series,
      parallelAxis: this.processedData.axis,
    };
    if (this.echartsInstance) {
      this.echartsInstance.resize();
    }
  }
}
