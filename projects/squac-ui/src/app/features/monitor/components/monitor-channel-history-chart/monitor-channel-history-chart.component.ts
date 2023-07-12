import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import { DatasetComponentOption } from "echarts";
import { NgxEchartsModule } from "ngx-echarts";
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
  standalone: true,
  imports: [NgxEchartsModule],
})
export class MonitorChannelHistoryChartComponent extends EChartComponent {
  /** monitor to display on chart  */
  @Input() monitor: Monitor;
  /** list of alerts (from same monitor) to be displayed */
  @Input() alerts: Alert[];
  /** alert to highlight */
  @Input() selectedAlert: Alert;
  /** emits alert when one is selected on the chart */
  @Output() selectedAlertChange: EventEmitter<Alert> = new EventEmitter();
  /** actual echart instance */
  @ViewChild("chartInstance") chartInstance;
  /** measurement pipe for transforming values */
  measurementPipe = new MeasurementPipe();
  /** min and max values of the data on chart  */
  dataRange: { min: number; max: number };
  /** Chart series name for alerts series */
  alertsSeriesName = "Alerts";
  /** chart series name for channels series */
  channelsSeriesName = "Channels";
  /** Channel series to display on chart */
  channelsSeries = [];
  /** Trigger series to display on chart */
  triggerSeries = [];
  /** EChart Dataset containing chart data */
  dataset: DatasetComponentOption[] = [];
  /** echarts conf for channels series */
  channelsSeriesConf: any = {
    type: "line",
    large: true,
    largeThreshold: 1000,
    legendHoverLink: true,
    connectNulls: false,
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
    super(widgetManager, null, null);
  }

  /**
   * Creates chart configuration before data is loaded
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
            formatter: (params: LabelFormatterParams): string => {
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
          type: "cross",
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

  /**
   * Event listener for chart events, emits selected alert when one is clicked
   *
   * @param $event echart event
   * @param type type of event
   */
  override onChartEvent($event, type): void {
    if (type === "chartClick" && $event.seriesName === this.alertsSeriesName) {
      this.selectedAlertChange.emit($event.value[4]);
    }
  }

  /**
   * Takes monitors and alerts and combine to create chart data
   *
   * @param _data chart data (unused)
   */
  buildChartData(_data: ProcessedData): Promise<void> {
    return new Promise<void>((resolve) => {
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
      this.alerts.forEach((alert: Alert) => {
        const start = this.dateService.parseUtc(alert.timestamp);
        const end = start.add(1, "hour").toDate();
        //channels breaching in this alert
        const channelsInAlert = new Set<string>();

        alert.breachingChannels.forEach((bc: BreachingChannel) => {
          channelsWithData.add(bc.channel);
          channelsInAlert.add(bc.channel);
          source.push([
            start.toDate(),
            end,
            bc.channel,
            bc[this.monitor.stat],
            alert.id,
          ]);
        });

        // Add a null value for each channel to disconnect the charts
        // if a channel isn't breaching any more
        channelsWithData.forEach((channel) => {
          // only add a null point if channel wasn't in this
          // alert
          if (!channelsInAlert.has(channel)) {
            source.push([start.toDate(), end, channel, null, alert.id]);
          }
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

      // this.triggerSeries.push(this.addTriggers());
      resolve();
    });
  }

  /**
   * Gets date with offset
   *
   * @param rawDate raw date value to process
   * @returns formatted date string
   */
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
    this.monitor.triggers.forEach((trigger: Trigger) => {
      const val2 = trigger.val2 ?? trigger.val1;

      const min = Math.min(trigger.val1, val2);
      const max = Math.max(trigger.val1, val2);
      if (min < this.dataRange.min) {
        this.dataRange.min = min;
      }
      if (max > this.dataRange.max) {
        this.dataRange.max = max;
      }
      const name = trigger.fullString;
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
   * Changes selected metrics on chart & updates dataset
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
  }
}
