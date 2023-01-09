import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import dayjs from "dayjs";
import { parseUtc } from "dist/widgets/lib/shared/utils";
import { EChartsOption, TooltipComponentPositionCallbackParams } from "echarts";
import { catchError, EMPTY, of, Subject, switchMap, tap } from "rxjs";
import {
  Alert,
  AlertService,
  Measurement,
  MeasurementPipe,
  Monitor,
  MonitorService,
} from "squacapi";
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
export class MonitorHistoryChartComponent extends EChartComponent {
  @Input() monitor: Monitor;
  measurementPipe = new MeasurementPipe();
  error: boolean;
  alerts: Alert[];
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
        name: "Measurement Start Date",
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
      legend: {
        show: true,
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
      tooltip: {
        formatter: (params: TooltipComponentPositionCallbackParams) => {
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
      // this.addThresholds();
      //start time to end time using intergal type and count, calulate metric
      const metric = this.selectedMetrics[0];
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
          const end = this.dateService.parseUtc(this.widgetManager.endtime);
          let start = this.dateService.parseUtc(this.widgetManager.starttime);
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

            station.data.push({
              name: nslc,
              value: [start.toDate(), end.toDate(), value],
            });

            start = intervalEnd;
          }
        }
        stations.push(station);
      });
      this.metricSeries.series = stations;
      resolve();
    });
  }

  /**
   * @override
   */
  changeMetrics(): void {
    const colorMetric = this.selectedMetrics[0];
    // const visualMaps = this.visualMaps[colorMetric.id];
    this.updateOptions = {
      series: this.metricSeries.series,
      xAxis: {
        min: this.widgetManager.starttime,
        max: this.widgetManager.endtime,
      },
    };

    if (this.echartsInstance) {
      this.echartsInstance.setOption(this.updateOptions, {
        replaceMerge: ["series"],
      });
    }
  }
}
