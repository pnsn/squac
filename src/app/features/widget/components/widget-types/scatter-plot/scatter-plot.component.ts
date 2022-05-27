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
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
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
  @Input() thresholds: [];
  @Input() channels: Channel[];
  @Input() dataRange: any;
  @Input() selectedMetrics: Metric[];
  @Input() showLegend: boolean;
  schema = [];
  subscription = new Subscription();
  results: Array<any>;
  options: any = {};
  updateOptions: any = {};
  initOptions: any = {};
  visualMaps: any = {};
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

    if (changes.showLegend) {
      this.toggleLegend();
    }
  }
  ngOnInit(): void {
    const chartOptions = {
      series: [],
      grid: {
        left: 65,
      },
      tooltip: {
        formatter: (params) => {
          return this.widgetTypeService.multiMetricTooltipFormatting(params);
        },
      },
    };

    this.options = this.widgetTypeService.chartOptions(chartOptions);
  }
  // toggleLegend() {}

  onChartEvent(event, type) {
    console.log(event.seriesName, type);
  }

  toggleLegend() {
    const temp = { ...this.updateOptions };
    if (this.showLegend) {
      temp.legend = {
        show: true,
        data: {
          name: "name",
        },
      };
      temp.grid = {
        right: 85,
      };
    } else {
      temp.legend = {
        show: false,
      };
      temp.grid = {
        right: 20,
      };
    }
    this.updateOptions = temp;
  }

  private buildChartData(data) {
    //if 3 metrics, visualMap
    const metricSeries = {
      type: "scatter",
      colorBy: "data", //unless visualMap
      data: [],
      large: true,
      dimensions: [],
      name: "name",
      encode: {
        x: 0,
        y: 1,
        tooltip: [0, 1, 2],
      },
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
    console.log(this.processedData);
  }

  changeMetrics() {
    const xMetric = this.selectedMetrics[0];
    const yMetric = this.selectedMetrics[1];
    const colorMetric = this.selectedMetrics[2];

    const visualMap = this.visualMaps[colorMetric.id] || null;

    this.updateOptions = {
      series: this.processedData.series,
      xAxis: {
        name: xMetric.name,
      },
      title: {
        text: colorMetric.name,
      },
      visualMap,
      yAxis: {
        name: yMetric.name,
      },
    };
  }
}
