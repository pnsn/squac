import { Component, OnDestroy, OnInit } from "@angular/core";
import { WidgetConnectService } from "../../services/widget-connect.service";
import { WidgetManagerService } from "../../services/widget-manager.service";
import { WidgetConfigService } from "../../services/widget-config.service";
import { EChartComponent } from "../e-chart.component";
import { WidgetTypeComponent } from "../../interfaces/widget-type.interface";

@Component({
  selector: "widget-parallel-plot",
  templateUrl: "../e-chart.component.html",
  styleUrls: ["../e-chart.component.scss"],
})
export class ParallelPlotComponent
  extends EChartComponent
  implements OnInit, OnDestroy, WidgetTypeComponent
{
  constructor(
    private widgetConfigService: WidgetConfigService,
    protected widgetConnectService: WidgetConnectService,
    protected widgetManager: WidgetManagerService
  ) {
    super(widgetManager, widgetConnectService);
  }

  configureChart(): void {
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
          return this.widgetConfigService.multiMetricTooltipFormatting(params);
        },
      },
      dataZoom: [],
    };
    this.options = this.widgetConfigService.chartOptions(chartOptions);
  }

  toggleKey(): void {
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

  buildChartData(data) {
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
      this.metricSeries = this.widgetConfigService.getSeriesForMultipleMetrics(
        this.selectedMetrics,
        this.channels,
        data,
        metricSeries
      );
      resolve();
    });
  }

  changeMetrics() {
    this.updateOptions = {
      ...this.updateOptions,
      series: this.metricSeries.series,
      parallelAxis: this.metricSeries.axis,
    };
    if (this.echartsInstance) {
      this.echartsInstance.setOption(this.updateOptions, {
        replaceMerge: ["series"],
      });
      this.resize();
    }
  }
}
