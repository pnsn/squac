import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Measurement } from "squacapi";

import { PrecisionPipe } from "../../pipes/precision.pipe";
import { EChartsOption } from "echarts";
import {
  WidgetConnectService,
  WidgetManagerService,
  WidgetConfigService,
} from "../../services";
import { ProcessedData, WidgetTypeComponent } from "../../interfaces";
import { parseUtc } from "../../utils";
import {
  singleXAxisConfig,
  tooltipFormatter,
  weekTimeXAxisConfig,
  weekXAxisConfig,
} from "./echart.config";
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from "ngx-echarts";
import { EChartComponent } from "../../components/e-chart/e-chart.component";

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
export class CalendarComponent
  extends EChartComponent
  implements OnInit, WidgetTypeComponent, OnDestroy
{
  constructor(
    private widgetConfigService: WidgetConfigService,
    protected widgetConnectService: WidgetConnectService,
    override widgetManager: WidgetManagerService,
    override ngZone: NgZone
  ) {
    super(widgetManager, widgetConnectService, ngZone);
  }
  /** time labes on chart x axis */
  xAxisLabels: string[] = [];
  /** second row of time labels on x axis */
  xAxisLabels2: string[] = [];
  /** Max allowable time between measurements to connect */
  maxMeasurementGap: number = 1 * 1000;
  /** pipe for transformation of values */
  precisionPipe = new PrecisionPipe();

  /**
   * Initial chart configuration
   */
  configureChart(): void {
    this.denseOptions["grid"]["bottom"] = this.getBottomMargin(true);
    this.fullOptions["grid"]["bottom"] = this.getBottomMargin(false);
    const dataZoom = this.denseView
      ? this.denseOptions.dataZoom
      : this.fullOptions.dataZoom;
    const grid = this.denseView
      ? this.denseOptions.grid
      : this.fullOptions.grid;
    this.options = {
      ...this.chartDefaultOptions,
      grid: {
        ...grid,
      },
      dataZoom,
      yAxis: {
        inverse: true,
        axisLabel: {
          fontSize: 11,
          width: 110,
          overflow: "truncate",
        },
        axisTick: {
          interval: 0,
        },
        type: "category",
        // nameGap: 35, //max characters
      },
      xAxis: {}, //have default xaxis config or error occurs
      tooltip: {
        ...this.chartDefaultOptions.tooltip,
        formatter: tooltipFormatter,
      },
      series: [],
    };
  }

  /**
   * figures out correct labels for axis
   *
   * @param displayType widget display type
   */
  getAxisLabels(displayType: string): void {
    const weekLabels: string[] = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const hourLabels: string[] = [];
    // const blanks = new Array(23);
    // blanks.fill("");
    for (let i = 0; i < 24; i++) {
      const label = i < 10 ? `0${i}` : `${i}`;
      hourLabels.push(label + ":00");
    }

    switch (displayType) {
      case "hours-day":
        this.xAxisLabels = [...hourLabels];
        break;

      case "hours-week":
        this.xAxisLabels = [];
        weekLabels.forEach((weekLabel) => {
          this.xAxisLabels2.push(weekLabel);

          hourLabels.forEach((label) => {
            this.xAxisLabels.push(`${weekLabel} ${label}`);
          });
        });

        break;

      default:
        this.xAxisLabels = [...weekLabels];
        break;
    }
  }

  /**
   * Creates chart data from measuremetns
   *
   * @param data processed data
   */
  buildChartData(data: ProcessedData): Promise<void> {
    return new Promise<void>((resolve) => {
      this.metricSeries = {};
      this.visualMaps = this.widgetConfigService.getVisualMapFromThresholds(
        this.selectedMetrics,
        this.properties,
        2
      );

      this.xAxisLabels = [];
      this.xAxisLabels2 = [];
      this.getAxisLabels(this.properties.displayType);

      const width = this.properties.displayType;

      // currently only 1 metric
      this.selectedMetrics.forEach((metric) => {
        if (!metric) return;
        let series;

        // set up metric series
        if (!this.metricSeries[metric.id]) {
          this.metricSeries[metric.id] = {
            series: [],
            yAxisLabels: [],
          };
          series = {
            type: "heatmap",
            data: [],
            large: true,
            emphasis: { focus: "series" },
            blur: {
              itemStyle: { opacity: 0.7 },
            },
            encode: {
              x: 0,
              y: 3,
              tooltip: [0, 1, 3],
            },
          };
          this.metricSeries[metric.id].series.push(series);
        } else {
          series = this.metricSeries[metric.id].series[0];
        }

        // get data for every channel
        this.channels.forEach((channel) => {
          const nslc = channel.nslc;
          this.metricSeries[metric.id].yAxisLabels.push(nslc);

          // store values
          const values: any[] = [];

          //associate data with created labels
          this.xAxisLabels.forEach((label) => {
            values.push({
              label,
              sum: 0,
              count: 0,
            });
          });

          if (data.has(channel.id)) {
            const measurements = data.get(channel.id)?.get(metric.id);
            //trusts that measurements are in order of time
            measurements?.forEach((measurement: Measurement) => {
              const measurementStart = parseUtc(measurement.starttime);

              // figure out which xAxisLabel this data should go to
              let timeSegmentIndex;
              if (width === "days-week") {
                timeSegmentIndex = measurementStart.day();
              } else if (width === "hours-day") {
                timeSegmentIndex = measurementStart.hour();
              } else if (width === "hours-week") {
                const weekday = measurementStart.day();
                const hour = measurementStart.hour();

                timeSegmentIndex = hour + weekday * 24;
              }

              if (values[timeSegmentIndex]) {
                values[timeSegmentIndex].count++;
                values[timeSegmentIndex].sum += measurement.value;
              }
            });
          }

          values.forEach((value) => {
            if (value.count > 0) {
              const avg = value.count > 0 ? value.sum / value.count : null;
              series.data.push([value.label, value.count, avg, nslc]);
            }
          });
        });
      });
      resolve();
    });
  }

  /**
   * calculated bottom margin for chart
   *
   * @param dense true if no zoom is used
   * @returns margin for bottom of chart
   */
  private getBottomMargin(dense: boolean): number {
    //denseview has no zoom bar
    let margin = dense ? 32 : 52;

    if (this.properties.displayType === "hours-week") {
      margin += 12;
    }
    return margin;
  }

  /**
   * Changes displayed metrics on the chart
   */
  changeMetrics(): void {
    const displayMetric = this.selectedMetrics[0];
    const colorMetric = this.selectedMetrics[0];
    const visualMaps = this.visualMaps[colorMetric.id];
    const axes: any[] = [];

    let name = "";
    if (this.properties.displayType) {
      name = this.properties.displayType.replace("-", " of ");
    }
    if (this.xAxisLabels2.length > 0) {
      const weekXAxis = weekXAxisConfig;
      const timeXAxis = weekTimeXAxisConfig;
      weekXAxis["data"] = this.xAxisLabels2;
      timeXAxis["data"] = this.xAxisLabels;
      weekXAxis["name"] = name;
      axes.push(timeXAxis);
      axes.push(weekXAxis);
    } else {
      const xAxis1 = singleXAxisConfig;
      //just one axis
      xAxis1["data"] = this.xAxisLabels;
      xAxis1["name"] = name;
      axes.push(xAxis1);
    }

    visualMaps.show = this.showKey;
    const options: EChartsOption = {
      series: this.metricSeries[displayMetric.id].series,
      visualMap: visualMaps,
      xAxis: axes,
      yAxis: {
        data: this.metricSeries[displayMetric.id].yAxisLabels,
      },
    };

    // using update options only prevented series from removing series
    // using the combo sets both the inital series and later updates
    if (!this.echartsInstance) {
      this.updateOptions = options;
    } else {
      this.echartsInstance.setOption(options, {
        replaceMerge: ["series", "xAxis"],
      });
    }
  }
}
