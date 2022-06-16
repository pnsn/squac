import {
  Component,
  Input,
  OnChanges,
  OnInit,
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
      this.buildChartData(this.data);
      this.changeMetrics();
    }

    if (changes.showStationList) {
      this.toggleStationList();
    }
  }
  ngOnInit(): void {
    const chartOptions = {
      parallel: {
        left: 30,
        right: 40,
        bottom: 20,
        top: 40,
        parallelAxisDefault: {
          nameTextStyle: {
            width: 15,
            overflow: "break",
          },
        },
      },
      grid: {
        left: 10,
        right: 10,
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
  resize() {}

  onChartInit(ec) {
    this.echartsInstance = ec;
  }
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
        parallel: {
          right: 90,
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
          right: 40,
        },
      };
    }

    this.updateOptions = { ...this.updateOptions, ...temp };
  }

  private buildChartData(data) {
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
    // const visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
    //   this.metrics,
    //   this.thresholds,
    //   this.dataRange
    // );
    this.processedData = this.widgetTypeService.getSeriesForMultipleMetrics(
      this.selectedMetrics,
      this.channels,
      data,
      metricSeries,
      this.dataRange
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
