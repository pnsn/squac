import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  WidgetConnectService,
  WidgetManagerService,
  WidgetConfigService,
} from "../../services";
import { EChartComponent } from "../abstract-components";
import { ProcessedData, WidgetTypeComponent } from "../../interfaces";
import { EChartsOption, ParallelSeriesOption } from "echarts";
import { copyChartOptions } from "../../shared/utils";
import { BASE_CHART_CONFIG } from "../e-chart/chart-config";

@Component({
  selector: "widget-parallel-plot",
  templateUrl: "../e-chart/e-chart.component.html",
  styleUrls: ["../e-chart/e-chart.component.scss"],
})
export class ParallelPlotComponent
  extends EChartComponent
  implements OnInit, OnDestroy, WidgetTypeComponent
{
  constructor(
    private widgetConfigService: WidgetConfigService,
    protected widgetConnectService: WidgetConnectService,
    override widgetManager: WidgetManagerService
  ) {
    super(widgetManager, widgetConnectService);
  }

  configureChart(): void {
    const chartOptions: EChartsOption = {
      parallel: {
        left: 10,
        bottom: 20,
        top: 20,
        right: 10,
        parallelAxisDefault: {
          nameTextStyle: {
            width: 15,
            // overflow: "break",
          },
        },
      },
      visualMap: [],
      grid: {
        left: 10,
      },
      xAxis: {},
      yAxis: {},
      tooltip: {
        formatter:
          this.widgetConfigService.multiMetricTooltipFormatting.bind(this),
      },
      dataZoom: [],
    };
    this.options = copyChartOptions(BASE_CHART_CONFIG, chartOptions);
  }

  override toggleKey(): void {
    let temp = {
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
    }

    if (this.echartsInstance) {
      this.echartsInstance.setOption(temp);
    }
  }

  buildChartData(data: ProcessedData): Promise<void> {
    return new Promise<void>((resolve) => {
      const metricSeries: ParallelSeriesOption = {
        type: "parallel",
        colorBy: "series",
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

      // TODO: separate axis call
      this.metricSeries = this.widgetConfigService.getSeriesForMultipleMetrics(
        this.selectedMetrics,
        this.channels,
        data,
        metricSeries
      );
      resolve();
    });
  }

  changeMetrics(): void {
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
