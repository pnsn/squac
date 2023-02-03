import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import {
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemReturn,
  EChartsOption,
  graphic,
  TooltipComponentFormatterCallbackParams,
} from "echarts";
import {
  Alert,
  BreachingChannel,
  MeasurementPipe,
  Monitor,
  Trigger,
} from "squacapi";
import {
  EChartComponent,
  LabelFormatterParams,
  ProcessedData,
  WidgetConfigService,
  WidgetManagerService,
} from "widgets";

/**
 * Component for viewing single monitor
 */
@Component({
  selector: "monitor-history-chart",
  templateUrl: "./monitor-history-chart.component.html",
  styleUrls: ["./monitor-history-chart.component.scss"],
})
export class MonitorHistoryChartComponent extends EChartComponent {
  @Input() monitor: Monitor;
  @Input() alerts: Alert[];
  @Input() selectedAlert: Alert;
  @Output() selectedAlertChange: EventEmitter<Alert> = new EventEmitter();
  @ViewChild("chartInstance") chartInstance;
  measurementPipe = new MeasurementPipe();
  error: boolean;
  dataRange: { min: number; max: number };
  alertsSeriesName = "Alerts";
  alertsSeries = [];
  // channelsSeriesName = "Channels";
  // channelsSeries = [];
  // channelsSeriesConf: any = {
  //   type: "line",
  //   large: true,
  //   largeThreshold: 1000,
  //   legendHoverLink: true,
  //   lineStyle: {
  //     width: 1,
  //     opacity: 1,
  //   },
  //   emphasis: {
  //     focus: "series",
  //   },

  //   symbol: "circle",
  //   symbolSize: 2,
  //   sampling: "lttb",
  // };

  alertsSeriesConfig: any = {
    yAxisIndex: 0,
    type: "custom",
    name: this.alertsSeriesName,
    dataGroupId: "alert",
    data: [],
    itemStyle: {
      color: "#808080",
      opacity: 0.7,
    },
    markArea: {
      data: [],
    },
    encode: {
      x: [0, 1],
      y: 3,
    },
    renderItem: this.renderItem,
  };

  constructor(
    public loadingService: LoadingService,
    private dateService: DateService,
    private widgetConfigService: WidgetConfigService,
    override widgetManager: WidgetManagerService
  ) {
    super(widgetManager, null);
  }

  // Max allowable time between measurements to connect
  maxMeasurementGap = 1.5;

  /**
   * @override
   */
  configureChart(): void {
    const chartOptions: EChartsOption = {
      xAxis: {
        type: "time",
        nameLocation: "middle",
        name: "Monitor Evaluation Time",
        nameGap: 14,
        axisPointer: {
          show: true,
          triggerTooltip: false,
          label: {
            formatter: (params: LabelFormatterParams) => {
              return this.getOffsetStart(params.value);
            },
          },
        },
        axisLabel: {
          fontSize: 11,
          margin: 3,
          formatter: (params: string) =>
            this.widgetConfigService.timeAxisTickFormatting(params),
        },
        nameTextStyle: {
          align: "center",
        },
        axisTick: {
          show: true,
        },
        axisLine: {
          show: true,
        },
        splitLine: {
          show: true,
        },
      },
      yAxis: {
        type: "category",
        position: "left",
      },
      legend: {
        show: false,
      },
      visualMap: {
        ...this.widgetConfigService.continuousDefaults,
        dimension: 2,
        text: ["Breaching Channels", ""],
        top: 10,
        precision: 0,
        seriesIndex: 0,
      },
      grid: {
        containLabel: true,
        top: 10,
        right: 8,
        bottom: 38,
        left: 25,
      },
      dataZoom: [
        {
          type: "slider",
          realtime: true,
          orient: "horizontal",
          moveHandleSize: 10,
          height: 15,
          showDetail: false,
          showDataShadow: false,
          bottom: 10,
          right: 20,
          xAxisIndex: [0, 1],
          filterMode: "none",
        },
      ],
      tooltip: {
        formatter: (params: TooltipComponentFormatterCallbackParams) => {
          if ("componentType" in params) {
            if (params.seriesName === this.alertsSeriesName) {
              const tooltipstr = `${this.getOffsetStart(params.value[0])} ${
                params.value[4].breachingChannels?.length
              } breaching channels`;
              return tooltipstr;
            }
            return "";
          }
          return this.widgetConfigService.timeAxisFormatToolTip(params);
        },
      },
    };

    this.options = this.widgetConfigService.chartOptions(chartOptions);
  }

  override onChartEvent($event, type) {
    if (type === "chartClick" && $event.seriesName === this.alertsSeriesName) {
      this.selectedAlertChange.emit($event.value[4]);
    }
  }
  /**
   * @override
   */
  buildChartData(data: ProcessedData): Promise<void> {
    return new Promise<void>((resolve) => {
      // this.visualMaps = this.widgetConfigService.getVisualMapFromThresholds(
      //   this.selectedMetrics,
      //   this.properties,
      //   2
      // );
      this.alertsSeries = [];
      // this.channelsSeries = [];

      //start time to end time using intergal type and count, calulate metric
      this.dataRange = {
        min: undefined,
        max: undefined,
      };
      this.metricSeries.yAxisLabels = [];
      // this.channels.forEach((channel) => {
      //   const nslc = channel.nslc;
      //   const channelSeries = {
      //     ...this.channelsSeriesConf,
      //     ...{
      //       name: nslc,
      //       id: nslc,
      //       data: [],
      //       count: 0,
      //       encode: {
      //         x: [0, 1],
      //         y: 2,
      //       },
      //     },
      //   };
      //   this.channelsSeries.push(channelSeries);
      // });
      this.monitor.triggers.forEach((trigger: Trigger, i: number) => {
        this.metricSeries.yAxisLabels.push(this.getTriggerLabel(trigger));
        this.addAlerts(trigger.id, i);
      });

      // const triggerSeries = this.addTriggers();
      // this.metricSeries.series.push(triggerSeries);
      // this.metricSeries.series.push(alertSeries);
      resolve();
    });
  }

  getOffsetStart(rawDate: Date | number | string): string {
    const date = this.dateService.parseUtc(rawDate);
    const newD = date.startOf("hour").add(5, "minutes");
    return this.dateService.displayFormat(newD);
  }

  /**
   * Add triggers to plots
   *
   * @returns trigger series
   */
  addTriggers(): unknown {
    const triggerSeries = {
      type: "line",
      name: "Triggers",
      dataGroupId: "triggers",
      markArea: {
        itemStyle: {
          color: "rgb(128,128,128)",
          opacity: 0.25,
        },

        // label: {
        //   position: "insideright",
        // },
        // emphasis: {
        //   label: {
        //     position: "insideright",
        //   },
        // },
        data: [],
      },
      data: [],
      markLine: {
        data: [],
      },
    };
    this.monitor.triggers.forEach((trigger) => {
      const val2 = trigger.val2 ?? trigger.val1;

      const min = Math.min(trigger.val1, val2);
      const max = Math.max(trigger.val1, val2);
      if (min < this.dataRange.min) {
        this.dataRange.min = min;
      }
      if (max > this.dataRange.max) {
        this.dataRange.max = max;
      }
      switch (trigger.valueOperator) {
        case "within":
          triggerSeries.markArea.data.push([
            {
              name: trigger.valueOperator,
              yAxis: min,
            },
            {
              yAxis: max,
            },
          ]);
          break;
        case "outsideof":
          triggerSeries.markArea.data.push(
            [
              {
                name: trigger.valueOperator,
                yAxis: Number.MIN_SAFE_INTEGER,
              },
              {
                yAxis: min,
              },
            ],
            [
              {
                name: trigger.valueOperator,
                yAxis: max,
              },
              {
                yAxis: Number.MAX_SAFE_INTEGER,
              },
            ]
          );
          break;

        case "<":
          triggerSeries.markArea.data.push([
            {
              name: trigger.valueOperator,
              yAxis: Number.MIN_SAFE_INTEGER,
            },
            {
              yAxis: min,
            },
          ]);
          break;
        case "<=":
          triggerSeries.markArea.data.push([
            {
              name: trigger.valueOperator,
              yAxis: Number.MIN_SAFE_INTEGER,
            },
            {
              yAxis: min,
            },
          ]);
          break;

        case ">":
          triggerSeries.markArea.data.push([
            {
              name: trigger.valueOperator,
              yAxis: min,
            },
            {
              yAxis: Number.MAX_SAFE_INTEGER,
            },
          ]);
          break;
        case ">=":
          triggerSeries.markArea.data.push([
            {
              name: trigger.valueOperator,
              yAxis: min,
            },
            {
              yAxis: Number.MAX_SAFE_INTEGER,
            },
          ]);
          break;
        case "==":
          triggerSeries.markLine.data.push([
            {
              name: trigger.valueOperator,
              yAxis: min - 0.5,
            },
            {
              yAxis: min + 0.5,
            },
          ]);
          break;
      }
    });
    return triggerSeries;
  }

  /**
   * Adds alarms to charts
   *
   * @returns alarm series
   */
  addAlerts(triggerId: number, triggerIndex: number): void {
    const series = {
      ...this.alertsSeriesConfig,
      ...{
        name: triggerId,
        data: [],
      },
    };
    this.alerts
      ?.filter((a) => a.triggerId === triggerId)
      .forEach((alert) => {
        if (alert.inAlarm) {
          this.addBreachingChannels(alert);
          const start = this.dateService.parseUtc(alert.timestamp);
          const breachingChannels = alert.breachingChannels.length;
          series.data.push({
            name: alert.id,
            value: [
              start.toDate(),
              start.add(1, "hour").toDate(),
              breachingChannels,
              triggerIndex,
              alert,
            ],
          });
        }
      });
    this.alertsSeries.push(series);
  }

  addBreachingChannels(alert: Alert) {
    const channelsData = [];
    alert.breachingChannels.forEach((bc: BreachingChannel) => {
      const start = this.dateService.parseUtc(alert.timestamp);
      channelsData.push({
        name: bc.channel,
        value: [
          start.toDate(),
          start.add(1, "hour").toDate(),
          bc[this.monitor.stat],
          alert,
        ],
      });
    });
    // this.channelsSeries.push(...channelsData);
  }

  getTriggerLabel(trigger: Trigger): string {
    /** Return string representation of trigger info */
    return `${trigger.numChannelsString} ${trigger.valueString}`;
  }
  /**
   * @override
   */
  changeMetrics(): void {
    this.updateOptions = {
      series: this.alertsSeries,
      xAxis: {
        min: this.widgetManager.starttime,
        max: this.widgetManager.endtime,
      },
      yAxis: {
        data: this.metricSeries.yAxisLabels,
      },
      visualMap: {
        precision: 0,
        min: 0,
        max: this.channels.length,
      },
    };
    if (this.echartsInstance) {
      this.echartsInstance.setOption(this.updateOptions, {
        replaceMerge: ["series"],
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
    const categoryIndex = api.value(3);
    const start = api.coord([api.value(0), categoryIndex]); //converts to xy coords
    const end = api.coord([api.value(1), categoryIndex]); //converts to xy coords
    const height = api.size([0, 1])[1] * 1;
    const rectShape = graphic.clipRectByRect(
      {
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height: height,
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
        transition: ["shape"],
        focus: "series",
        blur: {
          style: {
            opacity: 0.7,
          },
        },
        shape: {
          x: start[0],
          y: start[1] - height / 2,
          width: end[0] - start[0],
          height: height,
        },
        style: {
          fill: api.visual("color"),
        },
      }
    );
  }
}
