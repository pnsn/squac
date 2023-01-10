import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import dayjs from "dayjs";
import {
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemReturn,
  EChartsOption,
  graphic,
  TooltipComponentFormatterCallbackParams,
} from "echarts";
import { Alert, MeasurementPipe, Monitor } from "squacapi";
import {
  EChartComponent,
  LabelFormatterParams,
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
export class MonitorHistoryChartComponent
  extends EChartComponent
  implements OnChanges
{
  @Input() monitor: Monitor;
  @Input() alerts: Alert[];
  measurementPipe = new MeasurementPipe();
  error: boolean;
  dataRange: { min: number; max: number };
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

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes["alerts"]) {
      console.log(changes["alerts"]);
    }
  }
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
          label: {
            formatter: (params: LabelFormatterParams) =>
              this.widgetConfigService.timeAxisPointerLabelFormatting(params),
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
      },
      yAxis: {},
      legend: {
        show: true,
        orient: "vertical",
        right: 0,
      },
      tooltip: {
        formatter: (params: TooltipComponentFormatterCallbackParams) => {
          if ("componentType" in params) {
            if (params.seriesName === "Alerts") {
              console.log(params["data"]["name"]);
              return params["data"]["name"];
            }
            return "";
          }
          return this.widgetConfigService.timeAxisFormatToolTip(params);
        },
      },
    };

    this.options = this.widgetConfigService.chartOptions(chartOptions);
  }

  /**
   * @override
   */
  buildChartData(data): Promise<void> {
    return new Promise<void>((resolve) => {
      // this.visualMaps = this.widgetConfigService.getVisualMapFromThresholds(
      //   this.selectedMetrics,
      //   this.properties,
      //   2
      // );
      const stations = [];
      this.metricSeries = {};
      const series = {
        type: "line",
        step: "start",
        large: true,
        largeThreshold: 1000,
        legendHoverLink: true,
        lineStyle: {
          width: 1,
          opacity: 1,
        },
        emphasis: {
          focus: "series",
        },

        symbol: "circle",
        symbolSize: 2,
        sampling: "lttb",
      };

      //start time to end time using intergal type and count, calulate metric
      const metric = this.selectedMetrics[0];
      this.dataRange = {
        min: undefined,
        max: undefined,
      };
      this.channels.forEach((channel) => {
        const nslc = channel.nslc;
        const station = {
          ...series,
          ...{
            name: nslc,
            id: nslc,
            data: [],
            count: 0,
            encode: {
              x: [0, 1],
              y: 2,
            },
          },
        };
        let lastEnd: dayjs.Dayjs;
        if (data.has(channel.id)) {
          const measurements = data.get(channel.id).get(metric.id);

          //start at start time
          // increase at interval
          // take all measurements within that and calculate
          // iterate
          // value represents the calculated value for the last interval
          const end = this.dateService
            .parseUtc(this.widgetManager.endtime)
            .startOf("hour");
          let start = this.dateService
            .parseUtc(this.widgetManager.starttime)
            .startOf("hour");
          let i = 0; //measurement index
          while (start < end && measurements[i]) {
            const intervalEnd = start.add(
              this.monitor.intervalCount,
              this.monitor.intervalType
            );
            const intervalMeasurements = [];
            let lastMeasurementStart = this.dateService.parseUtc(
              measurements[i].starttime
            );
            //find all measurements in the time range
            while (lastMeasurementStart < intervalEnd) {
              intervalMeasurements.push(measurements[i]);
              i++;
              if (!measurements[i]) break;
              lastMeasurementStart = this.dateService.parseUtc(
                measurements[i].starttime
              );
            }

            const value = this.measurementPipe.transform(
              intervalMeasurements,
              this.monitor.stat
            );

            if (
              this.dataRange.min === undefined ||
              value < this.dataRange.min
            ) {
              this.dataRange.min = value;
            }
            if (
              this.dataRange.max === undefined ||
              value > this.dataRange.max
            ) {
              this.dataRange.max = value;
            }

            station.data.push({
              name: nslc,
              value: [intervalEnd.toDate(), start.toDate(), value],
            });

            start = intervalEnd;
          }
        }
        stations.push(station);
      });
      this.metricSeries.series = stations;
      console.log(this.alerts);
      const monitorSeries = this.addMonitor();
      const triggerSeries = this.addTriggers();
      this.metricSeries.series.push(triggerSeries);
      this.metricSeries.series.push(monitorSeries);
      resolve();
    });
  }

  addTriggers() {
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

  addMonitor() {
    const triggerSeries = {
      type: "custom",
      name: "Alerts",
      yAxisIndex: 1,
      dataGroupId: "monitor",
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
        y: 2,
      },
      renderItem: this.renderItem,
    };

    this.alerts?.forEach((alert) => {
      console.log(alert);
      if (alert.inAlarm) {
        const start = this.dateService.parseUtc(alert.timestamp);
        triggerSeries.data.push({
          name: alert.triggerId,
          value: [
            start.toDate(),
            start
              .add(this.monitor.intervalCount, this.monitor.intervalType)
              .toDate(),
            "In Alarm",
            0,
          ],
        });
      }
    });
    // console.log(triggerSeries);
    return triggerSeries;
  }

  /**
   * @override
   */
  changeMetrics(): void {
    this.updateOptions = {
      series: this.metricSeries.series,
      xAxis: {
        min: this.widgetManager.starttime,
        max: this.widgetManager.endtime,
      },
      yAxis: [
        {
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
          max: this.dataRange.max,
          min: this.dataRange.min,
        },
        {
          show: false,
          data: ["In Alarm"],
          type: "category",
          position: "right",
          axisLine: {
            show: false,
          },
        },
      ],
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
          opacity: 0.7,
        },
      }
    );
  }
}
