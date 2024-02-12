import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { MeasurementPipe, Channel, MeasurementTypes } from "squacapi";
import { EChartsOption } from "echarts";

import {
  WidgetConnectService,
  WidgetManagerService,
  WidgetConfigService,
} from "../../services";
import { WidgetTypeComponent } from "../../interfaces";
import { EChartComponent } from "../../components/e-chart/e-chart.component";
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from "ngx-echarts";
import { StationData } from "./types";

/**
 * Chart that plots channels as the y axis and time,
 * grouped into chunks of time on x axis
 */
@Component({
  selector: "widget-calendar-plot",
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
export class BudComponent
  extends EChartComponent
  implements OnInit, WidgetTypeComponent, OnDestroy
{
  constructor(
    private widgetConfigService: WidgetConfigService,
    override widgetConnector: WidgetConnectService,
    override widgetManager: WidgetManagerService,
    override ngZone: NgZone
  ) {
    super(widgetManager, widgetConnector, ngZone);
  }

  /** transform measurements */
  measurementPipe = new MeasurementPipe();

  /** configuration for when dense is enabled */
  override denseOptions = {
    grid: {
      containLabel: true,
      top: 0,
      right: 10,
      left: 10,
      bottom: 10,
    },
    dataZoom: [],
  };

  /** configuration for when dense is not enabled */
  override fullOptions = {
    grid: { containLabel: true, top: 0, right: 10, bottom: 10, left: 30 },
    dataZoom: this.chartDefaultOptions.dataZoom,
  };

  /**
   * @override
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
      grid,
      dataZoom,
      textStyle: {
        fontSize: 11,
      },
      xAxis: {
        show: false,
        type: "category",
        axisLine: {
          show: true,
        },
      },
      tooltip: {
        ...this.chartDefaultOptions.tooltip,
      },
      yAxis: {
        inverse: true,
        type: "category",
        data: [],
        axisLabel: {
          width: 30,
          hideOverlap: false,
          overflow: "truncate",
          interval: (index: number, value: string) => !!value,
        },
        axisPointer: {
          show: true,
        },
      },
      series: [],
    };
  }

  /**
   * @override
   */
  buildChartData(data: MeasurementTypes[]): Promise<void> {
    return new Promise<void>((resolve) => {
      this.metricSeries = {};

      const defaultSeries = {
        type: "heatmap",
        large: true,
        encode: {
          x: 0,
          y: 1,
          tooltip: [2],
        },
        emphasis: {
          itemStyle: {
            borderWidth: 1,
          },
        },
        yAxisIndex: 0,
        tooltip: {
          valueFormatter: (value) =>
            value === Number.MIN_SAFE_INTEGER
              ? "No Data"
              : value.toPrecision(4),
        },
        label: {
          show: true,
          formatter: (d) => d.name,
        },
        // renderItem: this.renderItem,
      };

      const numColumns = 20;
      this.selectedMetrics.forEach((metric) => {
        if (!metric) return;

        type Stations = Map<string, StationData>;
        type Networks = Map<string, Stations>;
        const networkData: Networks = new Map();

        //group by network and station?
        this.channels.forEach((channel: Channel) => {
          if (!networkData.get(channel.net)) {
            networkData.set(channel.net, new Map());
          }
          if (!networkData.get(channel.net)?.has(channel.sta)) {
            networkData.get(channel.net)?.set(channel.sta, {
              name: channel.sta,
              network: channel.net,
              channelData: [],
            });
          }
          const channelData: MeasurementTypes[] = data
            .filter((m) => m.channel === channel.id && m.metric === metric.id)
            .map((m) => {
              m.value = m.value ?? m[this.widgetManager.dataStat];
              return m;
            });

          const value = this.measurementPipe.transform(
            channelData,
            this.widgetManager.stat
          );

          this.widgetConfigService.calculateDataRange(metric.id, value);
          networkData
            .get(channel.net)
            .get(channel.sta)
            .channelData.push({ chan: channel.code, value: value });
        });

        const metricSeries = [];
        const networks = Array.from(networkData.keys()).sort();
        const yAxis2Labels: string[] = [];
        let rowIndex = 0;

        networks.forEach((net: string) => {
          let staIndex = 0;
          yAxis2Labels.push(`${net}`);
          const series = {
            ...defaultSeries,
            name: net,
            data: [],
          };
          networkData.get(net)?.forEach((value: StationData, sta) => {
            let dataCount = 0;
            let val: string | number =
              // find value to represent station with
              value.channelData.reduce((a, b) => {
                if (b.value !== null) {
                  dataCount++;
                  return a + b.value;
                } else {
                  return a;
                }
              }, 0) / dataCount;
            let itemStyle = {};
            if (isNaN(val) || dataCount === 0) {
              val = Number.MIN_SAFE_INTEGER;
              itemStyle = {
                color: "white",
                borderWidth: 1,
                borderColor: "Black",
                opacity: 0.6,
              };
            }
            const item = {
              name: sta,
              value: [staIndex, rowIndex, val, sta, value.channelData],
              itemStyle,
            };
            series.data.push(item);
            // metricSeries.push(series);
            if (staIndex === numColumns - 1) {
              rowIndex++;
              yAxis2Labels.push("");
              staIndex = 0;
            } else {
              staIndex++;
            }
          });
          rowIndex++;
          metricSeries.push(series);
        });

        if (!this.metricSeries[metric.id]) {
          this.metricSeries[metric.id] = {
            series: metricSeries,
            yAxis2Labels,
          };
        }

        this.visualMaps = this.widgetConfigService.getVisualMapFromThresholds(
          this.selectedMetrics,
          this.properties,
          2
        );
      });
      resolve();
    });
  }

  /**
   * @override
   */
  changeMetrics(): void {
    const displayMetric = this.selectedMetrics[0];
    const colorMetric = this.selectedMetrics[0];
    const visualMaps = this.visualMaps[colorMetric.id];
    visualMaps.show = this.showKey;

    const options: EChartsOption = {
      yAxis: {
        data: this.metricSeries[displayMetric.id]?.yAxis2Labels,
      },
      series: this.metricSeries[displayMetric.id]?.series,
      visualMap: visualMaps,
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
