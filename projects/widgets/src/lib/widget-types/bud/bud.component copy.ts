import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Measurement, MeasurementPipe, Channel } from "squacapi";
import {
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemReturn,
  EChartsOption,
  graphic,
  TooltipComponentFormatterCallbackParams,
} from "echarts";

import {
  WidgetConnectService,
  WidgetManagerService,
  WidgetConfigService,
} from "../../services";
import { isContinuous, WidgetTypeComponent } from "../../interfaces";
import { EChartComponent } from "../../components/e-chart/e-chart.component";
import { parseUtc } from "../../utils";
import { ProcessedData } from "../../interfaces";
import { LabelFormatterParams } from "../../interfaces";
import { OpUnitType } from "dayjs";
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from "ngx-echarts";
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
  override denseOptions: EChartsOption = {
    grid: {
      containLabel: false,
      top: 10,
      right: 105,
      left: 105,
      bottom: 32,
    },
    dataZoom: [],
  };

  override fullOptions: EChartsOption = {
    grid: {
      containLabel: false,
      top: 5,
      right: 105,
      left: 125,
      bottom: 52,
    },
    dataZoom: this.chartDefaultOptions.dataZoom,
  };

  // Max allowable time between measurements to connect
  maxMeasurementGap: number = 1 * 1000;
  xAxisLabels = [];
  isContinuous = isContinuous;

  /** transform measurements */
  measurementPipe = new MeasurementPipe();

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
      xAxis: {
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        type: "category",
        nameLocation: "middle",
        nameGap: 14,
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
      tooltip: {
        ...this.chartDefaultOptions.tooltip,
      },
      yAxis: {},
      series: [],
    };
  }

  /**
   * @override
   */
  buildChartData(data: ProcessedData): Promise<void> {
    return new Promise<void>((resolve) => {
      this.metricSeries = {};
      this.visualMaps = this.widgetConfigService.getVisualMapFromThresholds(
        this.selectedMetrics,
        this.properties,
        2
      );
      const defaultSeries = {
        type: "custom",
        large: true,
        encode: {
          x: 0,
          y: 1,
          tooltip: 2,
        },
        emphasis: {
          itemStyle: {
            borderWidth: 1,
          },
        },
        tooltip: {},
        yAxisIndex: 1,
        renderItem: this.renderItem,
        label: {
          show: true,
          formatter: function (d) {
            return d.name;
          },
        },
        labelLayout(params) {
          return {
            x: params.rect.x,
            y: params.rect.y + params.rect.height / 2,
            verticalAlign: "middle",
            align: "left",
          };
        },
      };

      this.selectedMetrics.forEach((metric) => {
        if (!metric) return;
        interface StationData {
          name: string;
          network: string;
          channelData: number[];
        }

        type Stations = Map<string, StationData>;
        type Networks = Map<string, Stations>;
        const networks: Networks = new Map();

        //group by network and station?
        this.channels.forEach((channel: Channel, index) => {
          if (!networks.get(channel.net)) {
            networks.set(channel.net, new Map());
          }
          if (!networks.get(channel.net)?.has(channel.sta)) {
            networks.get(channel.net)?.set(channel.sta, {
              name: channel.sta,
              network: channel.net,
              channelData: [],
            });
          }

          if (data.has(channel.id)) {
            const measurements = data.get(channel.id)?.get(metric.id) ?? [];

            const channelVal = this.measurementPipe.transform(
              measurements,
              this.widgetManager.stat
            );
            if (networks.get(channel.net)?.get(channel.sta)) {
              networks
                .get(channel.net)
                ?.get(channel.sta)
                ?.channelData.push(channelVal);
            }
          }
        });

        const metricSeries = [];
        const yAxisLabels = Array.from(networks.keys()).sort();
        const yAxis2Labels: string[] = [];
        let netIndex = 0;
        let rowIndex = 0;
        yAxisLabels.forEach((net: string) => {
          const series = {
            ...defaultSeries,
            name: net,
            data: [],
          };
          let staIndex = 0;
          yAxis2Labels.push(`${net} ${rowIndex}`);
          networks.get(net)?.forEach((value: StationData, sta) => {
            let val: string | number =
              value.channelData.reduce((a, b) => a + b, 0) /
              value.channelData.length;
            let itemStyle = {};
            if (isNaN(val)) {
              val = "No Data";
              itemStyle = {
                color: "white",
              };
            }
            const item = {
              name: sta,
              value: [staIndex, rowIndex, val],
              itemStyle,
            };
            series.data.push(item);
            // metricSeries.push(series);
            if (staIndex === 9) {
              rowIndex++;
              yAxis2Labels.push(`${net} ${rowIndex}`);
              staIndex = 0;
            } else {
              staIndex++;
            }
          });
          netIndex++;
          metricSeries.push(series);
        });

        if (!this.metricSeries[metric.id]) {
          this.metricSeries[metric.id] = {
            series: metricSeries,
            yAxisLabels, //networks
            yAxis2Labels,
          };
        }
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
    const yAxis: any[] = [];
    const yAxis1 = {
      type: "category",
      offset: 0,
      data: this.metricSeries[displayMetric.id]?.yAxisLabels,
      // nameGap: 35, //max characters
    };
    const yAxis2 = {
      inverse: true,
      type: "category",
      data: this.metricSeries[displayMetric.id]?.yAxis2Labels,
      // nameGap: 35, //max characters
    };
    yAxis.push(yAxis1);
    yAxis.push(yAxis2);
    const options: EChartsOption = {
      yAxis,
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

  /**
   * Render function for echart
   *
   * @param params - customs series params
   * @param api - api for render
   * @returns custom series render
   */
  renderItem(
    params: any,
    api: CustomSeriesRenderItemAPI
  ): CustomSeriesRenderItemReturn {
    // name: string;
    // network: string;
    // channelData: number[];
    // value: number | undefined;
    // xIndex: number | undefined;
    const categoryIndex = api.value(1);
    const start = api.coord([api.value(0), categoryIndex]); //converts to xy coords
    const end = api.coord([+api.value(0) + 1, categoryIndex]); //converts to xy coords
    const height = api.size([0, 1])[1];
    const width = end[0] - start[0];
    const x = start[0] - width / 2;
    const y = start[1] - height / 2;
    const fill = isNaN(+api.value(2)) ? "white" : api.visual("color");
    const rectShape = graphic.clipRectByRect(
      {
        x,
        y,
        width,
        height,
      },
      {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height,
      }
    );
    return (
      rectShape && {
        type: "rect",
        shape: {
          x,
          y,
          width,
          height,
        },
        transition: ["shape"],
        focus: "series",
        blur: {
          style: {
            opacity: 0.7,
          },
        },
        name: "test",
        style: {
          fill,
          lineWidth: 0.5,
          stroke: "black",
        },
      }
    );
  }
}
