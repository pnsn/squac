import { Component, OnInit, Input, ViewChild, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { MeasurementPipe } from '../../../../pipes/measurement.pipe';
import { Subscription } from 'rxjs';
import { ViewService } from 'src/app/core/services/view.service';
import { ChannelGroup } from 'src/app/core/models/channel-group';
import TimelinesChart, { Val } from 'timelines-chart';
import * as d3 from 'd3';
import { Widget } from 'src/app/core/models/widget';
import { Metric } from 'src/app/core/models/metric';
import { Threshold } from 'src/app/features/widgets/models/threshold';
import { Channel } from 'src/app/core/models/channel';
import { DataFormatService } from 'src/app/features/widgets/services/data-format.service';
import { Measurement } from 'src/app/features/widgets/models/measurement';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  providers: [MeasurementPipe]
})
export class TimelineComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() widget: Widget;

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
    private dataFormatService: DataFormatService,
    private viewService: ViewService,
    private measurement: MeasurementPipe
  ) {
  }

  ngOnInit() {
    this.metrics = this.widget.metrics;
    this.thresholds = this.widget.thresholds;
    this.channelGroup = this.widget.channelGroup;
    if ( this.channelGroup) {
      this.channels = this.channelGroup.channels;
    }
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
        if ((!dataMin && dataMin !== 0) || measurement.value < dataMin) {
          dataMin = measurement.value;
        }
        if ((!dataMax && dataMax !== 0) || measurement.value > dataMax) {
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
    const threshold = this.widget.thresholds[this.currentMetric.id];
    const defaultMax = this.currentMetric.maxVal;
    const defaultMin = this.currentMetric.minVal;

    if ( threshold ) {
      this.domainMin = threshold.min;
      this.domainMax = threshold.max;
    } else if ((defaultMin || defaultMin === 0) || (defaultMax || defaultMax === 0)) {
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
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.chart = TimelinesChart()(this.timelineDiv.nativeElement);
    this.chart.leftMargin(70);
    this.chart.rightMargin(60); 

    this.chart.enableOverview = false;
    const dataFormatSub = this.dataFormatService.formattedData.subscribe(
      response => {

        if (response) {
          this.startdate = this.viewService.getStartdate();
          this.enddate = this.viewService.getEnddate();

           // TODO: get this a different way -> selector maybe
          this.currentMetric = this.metrics[0];
          this.buildRows(response);
          this.viewService.status.next('finished');
        }
      }, error => {
        console.log('error in timeline data: ' + error);
      }
    );

    this.subscription.add(dataFormatSub);
  }

    // // produces number of fake measurements in the given time range
    // getFakeMeasurements(startdate, enddate, number) {
    //   let interval = (enddate.getTime() - startdate.getTime()) / number;
    //   let measurements = [];

    //   for (let i = 0; i < number; i++ ) {
    //     measurements.push({
    //       value: Math.round(Math.random()*100),
    //       starttime: new Date(startdate.getTime() + i * interval),
    //       endtime: new Date(startdate.getTime() + (i + 1) * interval )
    //     });
    //   }

    //   return measurements;
    // }

}
