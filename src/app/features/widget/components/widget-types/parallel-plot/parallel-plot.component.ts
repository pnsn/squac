import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { Channel } from "@squacapi/models/channel";
import { Metric } from "@squacapi/models/metric";
import { Threshold } from "@squacapi/models/threshold";
import { WidgetConnectService } from "@features/widget/services/widget-connect.service";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { Subscription } from "rxjs";
import { WidgetTypeComponent } from "../widget-type.component";
import { WidgetManagerService } from "@features/widget/services/widget-manager.service";
import { WidgetProperties } from "@squacapi/models/widget";

@Component({
  selector: "widget-parallel-plot",
  templateUrl: "../e-chart.component.html",
  styleUrls: ["../e-chart.component.scss"],
})
export class ParallelPlotComponent
  implements OnInit, OnChanges, OnDestroy, WidgetTypeComponent
{
  constructor(
    private widgetTypeService: WidgetTypeService,
    private widgetConnectService: WidgetConnectService,
    private widgetManager: WidgetManagerService
  ) {}

  data;
  channels: Channel[];
  selectedMetrics: Metric[];
  properties: any;

  @Input() showKey: boolean;

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
      (changes.data || changes.channels) &&
      this.channels?.length > 0 &&
      this.selectedMetrics.length > 0
    ) {
      this.buildChartData(this.data).then(() => {
        this.changeMetrics();
      });
    }

    if (changes.showKey) {
      this.toggleStationList();
    }
  }

  updateData(data: any): void {
    this.data = data;
    this.channels = this.widgetManager.channels;
    this.selectedMetrics = this.widgetManager.selectedMetrics;
    this.properties = this.widgetManager.properties;
    this.buildChartData(this.data).then(() => {
      this.changeMetrics();
    });
  }
  ngOnInit(): void {
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
      parallel: {
        left: 10,
        bottom: 20,
        top: 20,
        right: 10,
        parallelAxisDefault: {
          nameTextStyle: {
            width: 15,
            overflow: "break",
          },
        },
      },
      visualMap: [],
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.echartsInstance = null;
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

  toggleStationList() {
    let temp: any = {};
    if (this.showKey) {
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

    if (this.echartsInstance) {
      this.echartsInstance.setOption(temp);
    }
  }

  private buildChartData(data) {
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
        metricSeries
      );
      resolve();
    });
  }

  zoomStopped(event) {
    console.log(event);
  }

  changeMetrics() {
    this.updateOptions = {
      ...this.updateOptions,
      series: this.processedData.series,
      parallelAxis: this.processedData.axis,
    };
    if (this.echartsInstance) {
      this.echartsInstance.setOption(this.updateOptions, {
        replaceMerge: ["series"],
      });
      this.echartsInstance.resize();
    }
  }
}
