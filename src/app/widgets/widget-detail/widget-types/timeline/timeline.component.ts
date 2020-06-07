import { Component, OnInit, Input, ViewChild, EventEmitter, TemplateRef, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
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

    this.chart = TimelinesChart();

    const dataFormatSub = this.dataFormatService.formattedData.subscribe(
      response => {
        if (response) {
          this.startdate = this.viewService.getStartdate();
          this.enddate = this.viewService.getEnddate();

           // TODO: get this a different way -> selector maybe
          this.currentMetric = this.metrics[0];
          this.buildRows(response);
        }
      }, error => {
        console.log('error in timeline data: ' + error);
      }
    );


    this.subscription.add(dataFormatSub);

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
    if(this.timelineDiv) {
      const width = this.timelineDiv.nativeElement.offsetWidth;
      const height = this.timelineDiv.nativeElement.offsetHeight;
      this.chart.width(width);
    }
  }

  // FIXME: This is...not great
  private buildRows(measurements) {
    console.log(this.currentMetric);
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
        if (!dataMin || measurement.value < dataMin) {
          dataMin = measurement.value;
        }
        if (!dataMax || measurement.value > dataMax) {
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

    if ( threshold ) {
      this.domainMin = threshold.min;
      this.domainMax = threshold.max;
    } else if (this.currentMetric.minVal || this.currentMetric.maxVal) {
      this.domainMin = this.currentMetric.minVal;
      this.domainMax = this.currentMetric.maxVal;
    }
    if (!this.domainMin) {
      this.domainMin = dataMin;
    }
    if (!this.domainMax) {
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
    this.chart(this.timelineDiv.nativeElement).enableOverview(false);
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
