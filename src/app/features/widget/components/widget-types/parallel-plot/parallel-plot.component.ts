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
  @Input() thresholds: Threshold[];
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
      this.buildChartData(this.data).then(() => {
        this.changeMetrics();
      });
    }

    if (changes.showStationList) {
      this.toggleStationList();
    }
  }
  ngOnInit(): void {
    const chartOptions = {
      parallel: {
        left: 10,
        bottom: 20,
        top: 50,
        parallelAxisDefault: {
          nameTextStyle: {
            width: 15,
            overflow: "break",
          },
        },
      },
      grid: {
        left: 10,
      },
      xAxis: false,
      yAxis: false,
      tooltip: {
        formatter: (params) => {
          return this.widgetTypeService.multiMetricTooltipFormatting(params);
        },
      },
      dataZoom: [],
    };
    this.options = this.widgetTypeService.chartOptions(chartOptions);
  }
  // toggleStationList() {}

  onChartEvent(event, type) {
    console.log(event.seriesName, type);
  }

  onChartInit(ec) {
    this.echartsInstance = ec;
  }

  toggleStationList() {
    let temp: any = {};
    if (this.showStationList) {
      temp = {
        legend: {
          show: true,
        },
        grid: {
          right: 0,
        },
        parallel: {
          right: 75,
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
        parallel: {
          right: 10,
        },
      };
    }

    this.updateOptions = { ...this.updateOptions, ...temp };
  }

  private buildChartData(data) {
    this.loadingChange.emit("Building chart...");
    return new Promise<void>((resolve) => {
      const metricSeries = {
        type: "parallel",
        colorBy: "series",
        large: true,
        legendHoverLink: true,
        lineStyle: {
          opacity: 1,
        },
        emphasis: {
          focus: "series",
          blurScope: "coordinateSystem",
          disabled: false,
          lineStyle: {
            width: 2,
          },
        },
        dimensions: [],
      };
      this.processedData = this.widgetTypeService.getSeriesForMultipleMetrics(
        this.selectedMetrics,
        this.channels,
        data,
        metricSeries,
        this.dataRange
      );
      resolve();
    });
  }

  changeMetrics() {
    this.updateOptions = {
      series: this.processedData.series,
      parallelAxis: this.processedData.axis,
    };
    if (this.echartsInstance) {
      this.echartsInstance.resize();
    }
    this.loadingChange.emit(false);
  }
}
