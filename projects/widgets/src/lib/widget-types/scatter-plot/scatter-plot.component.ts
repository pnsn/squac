import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from "@angular/core";
import {
  WidgetConnectService,
  WidgetManagerService,
  WidgetConfigService,
} from "../../services";
import { ProcessedData, WidgetTypeComponent } from "../../interfaces";
import { EChartComponent } from "../../components/e-chart/e-chart.component";
import { TooltipComponentFormatterCallbackParams } from "echarts";
import { NgxEchartsModule } from "ngx-echarts";

/**
 * Scatter plot widget
 */
@Component({
  selector: "widget-scatter-plot",
  templateUrl: "../../components/e-chart/e-chart.component.html",
  styleUrls: ["../../components/e-chart/e-chart.component.scss"],
  standalone: true,
  imports: [NgxEchartsModule],
})
export class ScatterPlotComponent
  extends EChartComponent
  implements OnInit, WidgetTypeComponent, OnDestroy
{
  /** @ignore */
  constructor(
    private widgetConfigService: WidgetConfigService,
    protected widgetConnectService: WidgetConnectService,
    override widgetManager: WidgetManagerService,
    override ngZone: NgZone,
    override cdr: ChangeDetectorRef
  ) {
    super(widgetManager, widgetConnectService, ngZone);
  }

  /** configuration for when dense is enabled */
  override denseOptions: {
    grid: {
      containLabel: true;
      left: number;
      bottom: number;
      top: number;
      right: number;
    };
    dataZoom: any[];
  } = {
    grid: {
      containLabel: true,
      top: 5,
      right: 10,
      left: 30,
      bottom: 15,
    },
    dataZoom: [],
  };

  /** configuration for when dense is not enabled */
  override fullOptions = {
    grid: { containLabel: true, top: 5, right: 10, bottom: 38, left: 50 },
    dataZoom: this.chartDefaultOptions.dataZoom,
  };

  /**
   * sets up initial chart configuration
   */
  configureChart(): void {
    const dataZoom = this.denseView
      ? this.denseOptions.dataZoom
      : this.fullOptions.dataZoom;
    const grid = this.denseView
      ? this.denseOptions.grid
      : this.fullOptions.grid;

    this.options = {
      ...this.chartDefaultOptions,
      series: [],
      grid,
      dataZoom,
      xAxis: {
        axisLabel: {
          hideOverlap: true,
          fontSize: 11,
          formatter: (value: number): string => {
            return value.toPrecision(4);
          },
        },
        nameLocation: "middle",
        name: "Measurement Start Date",
        nameGap: 20,
        nameTextStyle: {
          align: "center",
        },
        axisTick: {
          show: true,
        },
        axisLine: {
          show: true,
        },
      },
      yAxis: {
        type: "value",
        nameLocation: "middle",
        axisLabel: {
          fontSize: 11,
          inside: true,
          formatter: (value: number): string => {
            return value.toPrecision(4);
          },
        },
        nameGap: 10,
      },
      tooltip: {
        ...this.chartDefaultOptions.tooltip,
        formatter: (params: TooltipComponentFormatterCallbackParams) =>
          this.widgetConfigService.multiMetricTooltipFormatting(params),
      },
    };
  }

  /**
   * Creates chart data from measurement data
   *
   * @param data measurement data
   */
  buildChartData(data: ProcessedData): Promise<void> {
    return new Promise<void>((resolve) => {
      //if 3 metrics, visualMap
      const metricSeries = {
        type: "scatter",
        colorBy: "series", //unless visualMap
        data: [],
        dimensions: [],
        name: "name",
        emphasis: {
          focus: "series",
        },
        symbolSize: 7,
        itemStyle: {
          opacity: 1,
          borderWidth: 1,
          borderColor: "#000",
        },
        clip: true,
        encode: {
          x: 0,
          y: 1,
          tooltip: [0, 1, 2],
        },
      };

      this.visualMaps = this.widgetConfigService.getVisualMapFromThresholds(
        this.selectedMetrics,

        this.properties,

        2
      );

      this.metricSeries = this.widgetConfigService.getSeriesForMultipleMetrics(
        this.selectedMetrics,
        this.channels,
        data,
        metricSeries,
        this.widgetManager.stat
      );
      resolve();
    });
  }

  /**
   * Changes shown metrics on chart
   */
  changeMetrics(): void {
    const xMetric = this.selectedMetrics[0];
    const yMetric = this.selectedMetrics[1];
    const colorMetric = this.selectedMetrics[2];
    const visualMaps = this.visualMaps[colorMetric.id];
    visualMaps.show = this.showKey;
    const options = {
      series: this.metricSeries.series,
      xAxis: {
        name: `${xMetric.name} (${xMetric.unit})`,
      },
      visualMap: visualMaps,
      yAxis: {
        name: `${yMetric.name} (${yMetric.unit})`,
      },
    };

    // using update options only prevented series from removing series
    // using the combo sets both the inital series and later updates
    if (!this.echartsInstance) {
      this.updateOptions = options;
    } else {
      this.echartsInstance.setOption(options, {
        replaceMerge: "series",
      });
    }
  }
}
