import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import {
  WidgetConnectService,
  WidgetManagerService,
  WidgetConfigService,
} from "../../services";
import { EChartComponent } from "../../components/e-chart/e-chart.component";
import { ProcessedData, WidgetTypeComponent } from "../../interfaces";
import {
  ParallelSeriesOption,
  TooltipComponentFormatterCallbackParams,
} from "echarts";
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from "ngx-echarts";
import { MeasurementTypes } from "squacapi";

/**
 * Parallel plot widget, shows multiple metrics on parallel axes
 */
@Component({
  selector: "widget-parallel-plot",
  templateUrl: "../../components/e-chart/e-chart.component.html",
  styleUrls: ["../../components/e-chart/e-chart.component.scss"],
  standalone: true,
  imports: [NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: (): unknown => ({
        echarts: (): unknown => import("echarts"),
      }),
    },
  ],
})
export class ParallelPlotComponent
  extends EChartComponent
  implements OnInit, OnDestroy, WidgetTypeComponent
{
  constructor(
    private widgetConfigService: WidgetConfigService,
    protected widgetConnectService: WidgetConnectService,
    override widgetManager: WidgetManagerService,
    override ngZone: NgZone
  ) {
    super(widgetManager, widgetConnectService, ngZone);
  }

  /**
   * overrides to disable parent useDenseView
   *
   * @param _useDenseView unused
   */
  override useDenseView(_useDenseView: boolean): void {
    return;
  }

  /**
   * Sets up initial chart configuration
   */
  configureChart(): void {
    this.options = {
      ...this.chartDefaultOptions,
      parallel: {
        left: 10,
        bottom: 20,
        top: 20,
        right: 10,
        parallelAxisDefault: {
          nameTextStyle: {
            width: 15,
            fontSize: 11,
            // overflow: "break",
          },
        },
      },
      visualMap: [],
      grid: {
        ...this.chartDefaultOptions.grid,
        left: 10,
      },
      xAxis: {},
      yAxis: {},
      tooltip: {
        ...this.chartDefaultOptions.tooltip,
        formatter: (params: TooltipComponentFormatterCallbackParams) =>
          this.widgetConfigService.multiMetricTooltipFormatting(params),
      },
      dataZoom: [],
    };
  }

  /**
   * On key toggle, shows or hides legend
   */
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

  /**
   * Builds chart data from processed data
   *
   * @param data processed measurements for chart
   */
  buildChartData(data: MeasurementTypes[]): Promise<void> {
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
        metricSeries,
        this.widgetManager.stat,
        this.widgetManager.dataStat
      );
      resolve();
    });
  }

  /**
   * updates series and axes on charts
   */
  changeMetrics(): void {
    const options = {
      series: this.metricSeries.series,
      parallelAxis: this.metricSeries.axis,
    };

    // using update options only prevented series from removing series
    // using the combo sets both the inital series and later updates
    if (!this.echartsInstance) {
      this.updateOptions = options;
    } else {
      this.echartsInstance.setOption(options, {
        replaceMerge: ["series", "parallelAxis"],
      });
      this.resize();
    }
  }
}
