import { Component, OnDestroy, OnInit } from "@angular/core";
import { PrecisionPipe } from "../../shared/pipes/precision.pipe";
import {
  WidgetConnectService,
  WidgetManagerService,
  WidgetConfigService,
} from "../../services";
import { WidgetTypeComponent } from "../../interfaces";
import { EChartComponent } from "../abstract-components";
import { DefaultLabelFormatterCallbackParams } from "echarts";

@Component({
  selector: "widget-scatter-plot",
  templateUrl: "../e-chart/e-chart.component.html",
  styleUrls: ["../e-chart/e-chart.component.scss"],
})
export class ScatterPlotComponent
  extends EChartComponent
  implements OnInit, WidgetTypeComponent, OnDestroy
{
  constructor(
    private widgetConfigService: WidgetConfigService,
    protected widgetConnectService: WidgetConnectService,
    override widgetManager: WidgetManagerService
  ) {
    super(widgetManager, widgetConnectService);
  }
  precisionPipe = new PrecisionPipe();
  configureChart(): void {
    const chartOptions = {
      series: [],
      grid: {
        left: 50,
      },
      xAxis: {
        formatter: (value: number): string => {
          return value.toPrecision(4);
        },
      },
      yAxis: {
        axisLabel: {
          inside: true,
        },
        nameGap: 10,
        formatter: (value: number): string => {
          return value.toPrecision(4);
        },
      },
      tooltip: {
        formatter: (params: DefaultLabelFormatterCallbackParams): string => {
          return this.widgetConfigService.multiMetricTooltipFormatting(params);
        },
      },
    };

    this.options = this.widgetConfigService.chartOptions(chartOptions);
  }

  buildChartData(data): Promise<void> {
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
        metricSeries
      );
      resolve();
    });
  }

  changeMetrics(): void {
    const xMetric = this.selectedMetrics[0];
    const yMetric = this.selectedMetrics[1];
    const colorMetric = this.selectedMetrics[2];
    const visualMap = this.visualMaps[colorMetric.id] || null;
    this.updateOptions = {
      series: this.metricSeries.series,
      xAxis: {
        name: `${xMetric.name} (${xMetric.unit})`,
      },
      visualMap,
      yAxis: {
        name: `${yMetric.name} (${yMetric.unit})`,
      },
    };
    if (this.echartsInstance) {
      this.echartsInstance.setOption(this.updateOptions, {
        replaceMerge: ["series"],
      });
    }
  }
}
