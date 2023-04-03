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
  graphic,
  TooltipComponentFormatterCallbackParams,
} from "echarts";
import { Alert, MeasurementPipe, Monitor, Trigger } from "squacapi";
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
    this.options = {
      ...this.chartDefaultOptions,
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
          hideOverlap: true,
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
        ...this.chartDefaultOptions.tooltip,
        show: true,
        trigger: "item",
        axisPointer: {
          type: "cross",
          snap: true,
        },
        formatter: (
          params: TooltipComponentFormatterCallbackParams
        ): string => {
          if ("componentType" in params) {
            const inAlarm = params.value[4].inAlarm
              ? "In Alarm"
              : "Out of Alarm";
            let tooltipstr = ` <div class='tooltip-name'>Status: ${inAlarm}</div>`;
            tooltipstr += `<table class='tooltip-table'> <tr><td> ${this.getOffsetStart(
              params.value[0]
            )} </td> <td> ${
              params.value[4].breachingChannels?.length
            } breaching channels</td></tr> </table>`;
            return tooltipstr;
          } else return this.widgetConfigService.timeAxisFormatToolTip(params);
        },
      },
    };
  }

  /** @override */
  override onChartEvent($event, type): void {
    if (type === "chartClick") {
      this.selectedAlertChange.emit($event.value[4]);
    }
  }
  /**
   * @override
   */
  buildChartData(_data: ProcessedData): Promise<void> {
    return new Promise<void>((resolve) => {
      this.alertsSeries = [];

      //start time to end time using intergal type and count, calulate metric
      this.dataRange = {
        min: undefined,
        max: undefined,
      };
      this.metricSeries.yAxisLabels = [];
      this.monitor.triggers.forEach((trigger: Trigger, i: number) => {
        this.metricSeries.yAxisLabels.push(trigger.fullString);
        this.addAlerts(trigger.id, i);
      });

      resolve();
    });
  }

  /**
   * Get date and format
   *
   * @param rawDate date to process
   * @returns formatted date
   */
  getOffsetStart(rawDate: Date | number | string): string {
    const date = this.dateService.parseUtc(rawDate);
    // const newD = date.startOf("hour").add(5, "minutes");
    return this.dateService.displayFormat(date);
  }

  /**
   * Adds alarms to charts
   *
   * @param triggerId if of trigger
   * @param triggerIndex index of trigger in monitor
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
        const start = this.dateService.parseUtc(alert.timestamp);

        let breachingChannels = null;
        if (alert.inAlarm) {
          breachingChannels = alert.breachingChannels.length;
        } else {
          breachingChannels = -100;
        }

        series.data.push({
          name: alert.id,
          value: [
            start.toDate(),
            start.add(59, "minutes").toDate(),
            breachingChannels,
            triggerIndex,
            alert,
          ],
        });
      });
    this.alertsSeries.push(series);
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
        type: "continuous",
        precision: 0,
        min: 0 - 0.001,
        max: this.channels.length + 0.001,
        range: [0, this.channels.length],
        outOfRange: {
          opacity: 0,
          color: "lightgray",
        },
      },
    };
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
