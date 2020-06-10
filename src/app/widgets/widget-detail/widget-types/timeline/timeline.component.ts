import { Component, OnInit, Input, ViewChild, OnDestroy, ElementRef, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';
import { Metric } from '../../../../shared/metric';
import { Channel } from '../../../../shared/channel';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { MeasurementPipe } from '../../../measurement.pipe';
import { Subject, Subscription } from 'rxjs';
import { Measurement } from 'src/app/widgets/measurement';
import { DataFormatService } from 'src/app/widgets/data-format.service';
import { ViewService } from 'src/app/shared/view.service';
import { ChannelGroup } from 'src/app/shared/channel-group';
import { Widget } from 'src/app/widgets/widget';
import { Threshold } from 'src/app/widgets/threshold';
import TimelinesChart, { TimelinesChartInstance, Val } from 'timelines-chart';
import * as d3 from 'd3';
import { MeasurementsService } from 'src/app/widgets/measurements.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  providers: [MeasurementPipe]
})
export class TimelineComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() widget: Widget;
  @Input() data;

  metrics: Metric[];
  thresholds: {[metricId: number]: Threshold};
  channelGroup: ChannelGroup;
  chart;
  channels: Channel[];
  @ViewChild('timeline', {read: ElementRef}) timelineDiv: ElementRef;

  subscription = new Subscription();
  ColumnMode = ColumnMode;
  SortType = SortType;
  rows = [];
  columns = [];
  currentMetric: Metric;
  enddate: Date;
  startdate: Date;
  loading = true;
  domainMin: number;
  domainMax: number;
  inThresholdColor = '#336178';
  outOfThresholdColor = '#ffa52d';
  // rows = [];
  constructor(
    private viewService: ViewService,
    private measurement: MeasurementPipe
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    this.metrics = this.widget.metrics;
    this.thresholds = this.widget.thresholds;
    this.channelGroup = this.widget.channelGroup;
    this.currentMetric = this.metrics[0];
    if ( this.channelGroup) {
      this.channels = this.channelGroup.channels;
    }
    this.startdate = this.viewService.getStartdate();
    this.enddate = this.viewService.getEnddate();
    console.log(changes)
    if(this.data) {
      this.buildRows(this.data);
    }
  }

  ngOnInit() {


        // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.chart = TimelinesChart()
    this.chart.leftMargin(65);
    this.chart.rightMargin(55); 

    this.viewService.status.next("finished");

    const resizeSub = this.viewService.resize.subscribe(
      widgetId => {
        if (widgetId === this.widget.id) {
          this.resize();
        }
      }, error => {
        console.log('error in timeline resize: ' + error);
      }

    );


    this.subscription.add(resizeSub);
  }

  private resize() {
    if (this.timelineDiv && this.timelineDiv.nativeElement) {
      const width = this.timelineDiv.nativeElement.offsetWidth;
      const height = this.timelineDiv.nativeElement.offsetHeight;
      if ( width > 0 && height > 0) {
        this.chart.width(width);
      }

      this.chart.refresh();
    }
  }

  // FIXME: This is...not great
  private buildRows(measurements) {
    console.log('current metric in timeline', this.currentMetric);
    const data = [];
    let dataMax: number;
    let dataMin: number;

    this.channels.forEach((channel) => {
      const stationGroup = channel.networkCode + '.' + channel.stationCode;
      const channelData = [];
      // measurements[channel.id][this.currentMetric.id] = this.getFakeMeasurements(this.startdate, this.enddate, 20)
      // go through the measurements
      measurements[channel.id][this.currentMetric.id].forEach(
       (measurement: Measurement, index) => {
        if ((!dataMin && dataMin != 0) || measurement.value < dataMin) {
          dataMin = measurement.value;
        }
        if ((!dataMax && dataMax !=0) || measurement.value > dataMax) {
          dataMax = measurement.value;
        }
        // make a data point
        const dataPoint = {
          val: measurement.value,
          timeRange: [new Date(measurement.starttime), new Date(measurement.endtime)]
        };

        channelData.push(dataPoint);
        }
      );

      const channelRow = {
        label: channel.loc + '.' + channel.code,
        data: channelData
      };

      // grab the correct station
      let stationRow = data.find(row => row.group === stationGroup);

      // if it doesn't exist, create it
      if (!stationRow) {
        data.push({
          group: stationGroup,
          data: []
        });
        stationRow = data.find(row => row.group === stationGroup);
      }
      // add channel to the station
      stationRow.data.push(channelRow);

    });

    console.log(dataMin, dataMax)

    const threshold = this.widget.thresholds[this.currentMetric.id];
    console.log(this.widget.thresholds);
    if ( threshold ) {
      this.domainMin = threshold.min;
      this.domainMax = threshold.max;
      console.log(this.domainMin, this.domainMax)
    } else if ((this.currentMetric.minVal || this.currentMetric.minVal === 0)|| (this.currentMetric.maxVal || this.currentMetric.maxVal === 0)) {
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
      .range([this.outOfThresholdColor, this.inThresholdColor, this.outOfThresholdColor]);

    this.chart.zDataLabel(this.currentMetric.unit)
      .zColorScale(colorScale)
      .zScaleLabel(this.currentMetric.unit);

    const formatTime = d3.timeFormat('%Y-%m-%d %-I:%M:%S %p');
    this.chart.segmentTooltipContent((d) => {
      const row1 = '<div> value: <span>' + d.val + ' (' + this.currentMetric.unit + ')</span></div>';
      const row2 = '<div> start: <span>' + formatTime(d.timeRange[0]) + '</span></div>';
      const row3 = '<div> end: <span>' + formatTime(d.timeRange[1]) + '</span></div>';
      return row1 + row2 + row3;
    });


    this.chart.data(data);
    this.resize();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.chart(this.timelineDiv.nativeElement)
    this.resize();

  }
}
