import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnDestroy,
  ElementRef,
  AfterViewInit,
  OnChanges,
} from "@angular/core";
import { ColumnMode, SortType } from "@swimlane/ngx-datatable";
import { MeasurementPipe } from "@features/widgets/pipes/measurement.pipe";
import { Subscription } from "rxjs";
import { ViewService } from "@core/services/view.service";
import { ChannelGroup } from "@core/models/channel-group";
import TimelinesChart, { Val } from "timelines-chart";
import * as d3 from "d3";
import { Widget } from "@features/widgets/models/widget";
import { Metric } from "@core/models/metric";
import { Threshold } from "@features/widgets/models/threshold";
import { Channel } from "@core/models/channel";
import { Measurement } from "@features/widgets/models/measurement";
import { Archive } from "@features/widgets/models/archive";

@Component({
  selector: "widget-timeline",
  templateUrl: "./timeline.component.html",
  styleUrls: ["./timeline.component.scss"],
  providers: [MeasurementPipe],
})
export class TimelineComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  @Input() widget: Widget;
  @Input() data;

  metrics: Metric[];
  thresholds: { [metricId: number]: Threshold };
  channelGroup: ChannelGroup;

  channels: Channel[];
  @ViewChild("timeline", { read: ElementRef }) timelineDiv: ElementRef;
  chart;
  subscription = new Subscription();
  ColumnMode = ColumnMode;
  SortType = SortType;
  rows = [];
  columns = [];
  currentMetric: Metric;
  // enddate: Date;
  // startdate: Date;
  loading = true;
  domainMin: number;
  domainMax: number;
  inThresholdColor = "#4488A9";
  outOfThresholdColor = "#ffb758";

  // rows = [];
  constructor(private viewService: ViewService) {
    this.chart = TimelinesChart();
  }

  ngOnChanges(): void {
    // this.chart = TimelinesChart();
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    this.metrics = this.widget.metrics;
    this.thresholds = this.widget.thresholds;
    this.channelGroup = this.widget.channelGroup;
    this.currentMetric = this.metrics[0];
    if (this.channelGroup) {
      this.channels = this.channelGroup.channels;
    }
    if (this.data) {
      this.buildRows(this.data);
    }
  }

  ngOnInit() {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    if (this.chart) {
      this.chart.leftMargin(75);
      this.chart.rightMargin(55);
      this.chart.useUtc(true);
    }

    const resizeSub = this.viewService.resize.subscribe(
      (widgetId) => {
        if (!widgetId || widgetId === this.widget.id) {
          setTimeout(() => {
            this.resize();
          }, 500);
        }
      },
      (error) => {
        console.log("error in timeline resize: " + error);
      }
    );

    this.subscription.add(resizeSub);
  }

  private resize(rows?: number) {
    if (this.timelineDiv && this.timelineDiv.nativeElement) {
      const width = this.timelineDiv.nativeElement.offsetWidth;
      const height = this.timelineDiv.nativeElement.offsetHeight;
      // const offset = 55;
      if (width > 0 && height > 0) {
        this.chart.width(width);
        // this.chart.maxHeight(height-offset);
        let lineCount;
        if (rows) {
          lineCount = rows;
        } else {
          lineCount = this.chart.getNLines();
        }
        if (lineCount) {
          this.chart.maxHeight(lineCount * 12);
        }
      }
      this.chart.refresh();
    }
  }

  private buildRows(measurements) {
    const data = [];
    let dataMax: number;
    let dataMin: number;
    let lines = 0;

    this.channels.forEach((channel) => {
      const stationGroup = channel.networkCode + "." + channel.stationCode;
      const channelData = [];

      if (
        measurements[channel.id] &&
        measurements[channel.id][this.currentMetric.id]
      ) {
        // go through the measurements
        measurements[channel.id][this.currentMetric.id].forEach(
          (measurement: Measurement | Archive) => {
            if ((!dataMin && dataMin !== 0) || measurement.value < dataMin) {
              dataMin = measurement.value;
            }
            if ((!dataMax && dataMax !== 0) || measurement.value > dataMax) {
              dataMax = measurement.value;
            }
            // make a data point
            const dataPoint = {
              val: measurement.value,
              timeRange: [
                new Date(measurement.starttime),
                new Date(measurement.endtime),
              ],
            };

            channelData.push(dataPoint);
          }
        );
      }
      lines++;
      const channelRow = {
        label: channel.loc + "." + channel.code,
        data: channelData,
      };

      // grab the correct station
      let stationRow = data.find((row) => row.group === stationGroup);

      // if it doesn't exist, create it
      if (!stationRow) {
        data.push({
          group: stationGroup,
          data: [],
        });
        stationRow = data.find((row) => row.group === stationGroup);
      }
      // add channel to the station
      stationRow.data.push(channelRow);
    });

    const threshold = this.widget.thresholds[this.currentMetric.id];
    const defaultMax = this.currentMetric.maxVal;
    const defaultMin = this.currentMetric.minVal;
    const colorScale = this.handleThresholds(
      threshold,
      defaultMax,
      defaultMin,
      dataMax,
      dataMin
    );

    this.chart
      .zDataLabel(this.currentMetric.unit)
      .zColorScale(colorScale)
      .zScaleLabel(this.currentMetric.unit);

    const formatTime = d3.timeFormat("%Y-%m-%d %-I:%M:%S %p");
    this.chart.segmentTooltipContent((d) => {
      const row1 =
        "<div> value: <span>" +
        d.val +
        " (" +
        this.currentMetric.unit +
        ")</span></div>";
      const row2 =
        "<div> start: <span>" + formatTime(d.timeRange[0]) + "</span></div>";
      const row3 =
        "<div> end: <span>" + formatTime(d.timeRange[1]) + "</span></div>";
      return row1 + row2 + row3;
    });

    this.chart.data(data);
    this.chart.maxHeight(lines * 12);
    this.resize();
  }

  handleThresholds(threshold, defaultMax, defaultMin, dataMax, dataMin) {
    if (threshold) {
      this.domainMin = threshold.min;
      this.domainMax = threshold.max;
    } else if (
      defaultMin ||
      defaultMin === 0 ||
      defaultMax ||
      defaultMax === 0
    ) {
      this.domainMin = this.currentMetric.minVal;
      this.domainMax = this.currentMetric.maxVal;
    }
    if (!this.domainMin && this.domainMin !== 0) {
      this.domainMin = dataMin;
    }
    if (!this.domainMax && this.domainMax !== 0) {
      this.domainMax = dataMax;
    }

    this.loading = false;
    // FIXME: domain in exclusive on upper end
    const colorScale = d3
      .scaleThreshold<Val, string>()
      .domain([this.domainMin, this.domainMax + 0.0000001])
      .range([
        this.outOfThresholdColor,
        this.inThresholdColor,
        this.outOfThresholdColor,
      ]);

    return colorScale;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    // d3.selectAll("rect").attr('height', '20px');
    this.chart(this.timelineDiv.nativeElement);

    // this.chart.onZoom(([startDate, endDate], [startY, endY]) => {
    //   const visibleLines = endY - startY;
    //   this.chart.maxHeight(visibleLines*12);
    //   this.resize(visibleLines);
    // });
    this.resize();
  }
}
