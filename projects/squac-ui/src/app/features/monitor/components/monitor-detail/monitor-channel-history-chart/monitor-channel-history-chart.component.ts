import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import { DatasetComponentOption, EChartsOption } from "echarts";
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
  selector: "monitor-channel-history-chart",
  templateUrl: "./monitor-channel-history-chart.component.html",
  styleUrls: ["./monitor-channel-history-chart.component.scss"],
})
export class MonitorChannelHistoryChartComponent extends EChartComponent {
  @Input() monitor: Monitor;
  @Input() alerts: Alert[];
  @Input() selectedAlert: Alert;
  @Output() selectedAlertChange: EventEmitter<Alert> = new EventEmitter();
  @ViewChild("chartInstance") chartInstance;
  measurementPipe = new MeasurementPipe();
  error: boolean;
  dataRange: { min: number; max: number };
  alertsSeriesName = "Alerts";
  channelsSeriesName = "Channels";
  channelsSeries = [];
  triggerSeries = [];
  dataset: DatasetComponentOption[] = [];
  channelsSeriesConf: any = {
    type: "line",
    large: true,
    largeThreshold: 1000,
    legendHoverLink: true,
    lineStyle: {
      width: 1,
      opacity: 1,
    },
    step: "start",
    emphasis: {
      focus: "series",
      endLabel: {
        show: true,
      },
    },
    symbol: "circle",
    symbolSize: 3,
    sampling: "lttb",
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
    this.options = {
      ...this.chartDefaultOptions.tooltip,
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
          hideOverlap: true,
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
        type: "value",
        nameLocation: "middle",
        axisLabel: {
          fontSize: 11,
        },
        axisLine: {
          show: true,
        },
        axisTick: {
          show: true,
        },
      },
      legend: {
        show: false,
      },
      visualMap: [],
      grid: {
        containLabel: true,
        top: 20,
        right: 8,
        bottom: 38,
        left: 25,
      },
      tooltip: {
        ...this.chartDefaultOptions.tooltip,
        trigger: "item",
        show: true,
        appendToBody: true,
        axisPointer: {
          snap: true,
        },
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
    };
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

      const channelsWithData = new Set<string>();
      this.channelsSeries = [];
      this.triggerSeries = [];

      //start time to end time using intergal type and count, calulate metric
      this.dataRange = {
        min: undefined,
        max: undefined,
      };

      this.dataset = [];

      const dimensions = ["starttime", "endtime", "channel", "value", "alert"];
      const source = [];
      this.dataset.push({
        dimensions,
        source,
      });
      this.alerts.forEach((alert) => {
        const start = this.dateService.parseUtc(alert.timestamp);
        const end = start.add(1, "hour").toDate();
        alert.breachingChannels.forEach((bc: BreachingChannel) => {
          channelsWithData.add(bc.channel);
          source.push([
            start.toDate(),
            end,
            bc.channel,
            bc[this.monitor.stat],
            alert.id,
          ]);
        });
      });

      let index = 1; //start at 1, original data is at 0
      for (const channel of channelsWithData.values()) {
        this.dataset.push({
          transform: [
            {
              type: "filter",
              config: { dimension: "channel", value: channel },
            },
          ],
        });
        this.channelsSeries.push({
          ...this.channelsSeriesConf,
          ...{
            name: channel,
            datasetIndex: index,
            encode: {
              x: 0,
              y: 3,
              seriesName: 2,
              itemGroupId: 5,
              itemId: [2, 4],
              tooltip: 3,
              label: 2,
            },
          },
        });

        index++;
      }

      this.triggerSeries.push(this.addTriggers());
      resolve();
    });
  }

  getOffsetStart(rawDate: Date | number | string): string {
    const date = this.dateService.parseUtc(rawDate);
    // const newD = date.startOf("hour").add(5, "minutes");
    return this.dateService.displayFormat(date);
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
      const name = this.getTriggerLabel(trigger);
      let yAxis0;
      let yAxis1;
      if (trigger.valueOperator === "within") {
        yAxis0 = min;
        yAxis1 = max;
      } else if (
        trigger.valueOperator === "<" ||
        trigger.valueOperator === "<=" ||
        trigger.valueOperator === "outsideof"
      ) {
        yAxis0 = Number.MIN_SAFE_INTEGER;
        yAxis1 = min;
      } else if (
        trigger.valueOperator === ">" ||
        trigger.valueOperator === ">="
      ) {
        yAxis0 = min;
        yAxis1 = Number.MAX_SAFE_INTEGER;
      } else if (trigger.valueOperator === "==") {
        yAxis0 = min - 0.5;
        yAxis1 = max - 0.5;
      }

      triggerSeries.markArea.data.push([
        {
          name,
          yAxis: yAxis0,
        },
        {
          yAxis: yAxis1,
        },
      ]);

      // outsideof needs extra
      if (trigger.valueOperator === "outsideof") {
        triggerSeries.markArea.data.push([
          {
            name,
            yAxis: max,
          },
          {
            yAxis: Number.MAX_SAFE_INTEGER,
          },
        ]);
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
    const seriesData = [];
    this.alerts
      ?.filter((a) => a.triggerId === triggerId)
      .forEach((alert) => {
        if (alert.inAlarm) {
          this.addBreachingChannels(alert);
          const start = this.dateService.parseUtc(alert.timestamp);
          const breachingChannels = alert.breachingChannels.length;
          seriesData.push({
            name: alert.triggerId,
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
      series: [...this.channelsSeries, ...this.triggerSeries],
      dataset: this.dataset,
      xAxis: {
        min: this.widgetManager.starttime,
        max: this.widgetManager.endtime,
      },
      yAxis: {
        min: this.dataRange.min,
        max: this.dataRange.max,
      },
    };
    if (this.echartsInstance) {
      this.echartsInstance.setOption(this.updateOptions, {
        replaceMerge: ["series"],
      });
    }
  }
}
