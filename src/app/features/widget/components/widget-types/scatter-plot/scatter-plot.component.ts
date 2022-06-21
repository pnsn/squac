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
  @Input() thresholds: [];
  @Input() channels: Channel[];
  @Input() dataRange: any;
  @Input() selectedMetrics: Metric[];
  @Input() showStationList: boolean;
  @Input() properties: any[];
  @Input() loading: string | boolean;
  @Output() loadingChange = new EventEmitter();
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
      changes.data &&
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
    const chartOptions = {
      series: [],
      grid: {
        left: 45,
      },
      tooltip: {
        formatter: (params) => {
          return this.widgetTypeService.multiMetricTooltipFormatting(params);
        },
      },
    };

    this.options = this.widgetTypeService.chartOptions(chartOptions);
  }
  // toggleStationList() {}

  onChartEvent(event, type) {
    console.log(event.seriesName, type);
  }

  resize() {}

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

  private buildChartData(data) {
    this.loadingChange.emit("Building chart...");
    //if 3 metrics, visualMap
    const metricSeries = {
      type: "scatter",
      colorBy: "series", //unless visualMap
      data: [],
      large: true,
      dimensions: [],
      name: "name",
      emphasis: {
        focus: "series",
        label: {
          show: false,
          color: "black",
        },
      },
      encode: {
        x: 0,
        y: 1,
        tooltip: [0, 1, 2],
      },
    };

    this.visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
      this.selectedMetrics,
      this.thresholds,
      this.properties,
      this.dataRange,
      2
    );

    this.processedData = this.widgetTypeService.getSeriesForMultipleMetrics(
      this.selectedMetrics,
      this.channels,
      data,
      metricSeries,
      this.dataRange
    );
  }

  changeMetrics() {
    const xMetric = this.selectedMetrics[0];
    const yMetric = this.selectedMetrics[1];
    const colorMetric = this.selectedMetrics[2];
    const visualMap = this.visualMaps[colorMetric.id] || null;
    this.loadingChange.emit(false);
    this.updateOptions = {
      series: this.processedData.series,
      xAxis: {
        name: `${xMetric.name} (${xMetric.unit})`,
      },
      title: {
        text: `${colorMetric.name} (${colorMetric.unit})`,
      },
      visualMap,
      yAxis: {
        name: `${yMetric.name} (${yMetric.unit})`,
        nameGap: 48,
      },
    };
  }
}
