import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import {
  Measurement,
  MeasurementPipe,
  Channel,
  MeasurementTypes,
} from "squacapi";
import {
  EChartsOption,
  registerTransform,
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
import {
  ExternalDataTransform,
  aggregate,
} from "@manufac/echarts-simple-transform";
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
    registerTransform(aggregate as ExternalDataTransform);
  }

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
          formatter: function (d) {
            return d.name;
          },
        },
        // renderItem: this.renderItem,
      };

      const dataSet = [
        {
          id: "raw",
          source: data, //
        },
      ];
      interface ChannelData {
        chan: string;
        value: number;
      }

      const numColumns = 20;
      this.selectedMetrics.forEach((metric) => {
        if (!metric) return;
        interface StationData {
          name: string;
          network: string;
          channelData: ChannelData[];
        }

        type Stations = Map<string, StationData>;
        type Networks = Map<string, Stations>;
        const networks: Networks = new Map();

        //group by network and station?
        this.channels.forEach((channel: Channel) => {
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
          networks
            .get(channel.net)
            .get(channel.sta)
            .channelData.push({ chan: channel.code, value: value });
        });

        const metricSeries = [];
        const yAxisLabels = Array.from(networks.keys()).sort();
        const yAxis2Labels: string[] = [];
        let netIndex = 0;
        let rowIndex = 0;

        yAxisLabels.forEach((net: string) => {
          let staIndex = 0;
          yAxis2Labels.push(`${net}`);
          const series = {
            ...defaultSeries,
            name: net,
            data: [],
          };
          networks.get(net)?.forEach((value: StationData, sta) => {
            let dataCount = 0;
            let val: string | number =
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
          netIndex++;
          rowIndex++;
          metricSeries.push(series);
        });

        if (!this.metricSeries[metric.id]) {
          this.metricSeries[metric.id] = {
            series: metricSeries,
            yAxisLabels, //networks
            yAxis2Labels,
          };
        }
        // FIXME: Need min and max first
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

  // /**
  //  * Render function for echart
  //  *
  //  * @param params - customs series params
  //  * @param api - api for render
  //  * @returns custom series render
  //  */
  // renderItem(
  //   params: any,
  //   api: CustomSeriesRenderItemAPI
  // ): CustomSeriesRenderItemReturn {
  //   // name: string;
  //   // network: string;
  //   // channelData: number[];
  //   // value: number | undefined;
  //   // xIndex: number | undefined;
  //   const categoryIndex = api.value(1);
  //   const start = api.coord([api.value(0), categoryIndex]); //converts to xy coords
  //   const end = api.coord([+api.value(0) + 1, categoryIndex]); //converts to xy coords
  //   const height = api.size([0, 1])[1];
  //   const width = end[0] - start[0];
  //   const x = start[0] - width / 2;
  //   const y = start[1] - height / 2;
  //   const fill = isNaN(+api.value(2)) ? "white" : api.visual("color");
  //   const rectShape = graphic.clipRectByRect(
  //     {
  //       x,
  //       y,
  //       width,
  //       height,
  //     },
  //     {
  //       x: params.coordSys.x,
  //       y: params.coordSys.y,
  //       width: params.coordSys.width,
  //       height: params.coordSys.height,
  //     }
  //   );
  //   const rectText = graphic.clipRectByRect(params, {
  //     x: x,
  //     y: y,
  //     width,
  //     height,
  //   });
  //   return {
  //     type: "group",
  //     children: [
  //       {
  //         type: "rect",
  //         ignore: !rectShape,
  //         shape: rectShape,
  //         style: api.style(),
  //       },
  //       {
  //         type: "rect",
  //         ignore: !rectText,
  //         shape: rectText,
  //         style: api.style({
  //           text: `${api.value(3)}`,
  //           fill: api.visual("color"),
  //         }),
  //       },
  //     ],
  //   };

  //   return (
  //     rectShape && {
  //       type: "rect",
  //       shape: {
  //         x,
  //         y,
  //         width,
  //         height,
  //       },
  //       transition: ["shape"],
  //       focus: "series",
  //       blur: {
  //         style: {
  //           opacity: 0.7,
  //         },
  //       },
  //       name: "test",
  //       style: {
  //         fill,
  //         lineWidth: 0.5,
  //         stroke: "black",
  //       },
  //       textContent: {
  //         type: "text",
  //         style: {
  //           text: `${api.value(3)}`,
  //           fontFamily: "Verdana",
  //           fill: "#000",
  //           width: width - 4,
  //           overflow: "truncate",
  //           ellipsis: "..",
  //           truncateMinChar: 1,
  //         },
  //         emphasis: {
  //           style: {
  //             stroke: "#000",
  //             lineWidth: 0.5,
  //           },
  //         },
  //       },
  //     }
  //   );
  // }
}
