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

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  providers: [MeasurementPipe]
})
export class TimelineComponent implements OnInit, OnDestroy {
  @Input() widget: Widget;

  metrics: Metric[];
  thresholds: {[metricId: number]: Threshold};
  channelGroup: ChannelGroup;
  chart;
  channels: Channel[];
  @ViewChild("timeline", {read: ElementRef}) timelineDiv: ElementRef;

  subscription = new Subscription();
  ColumnMode = ColumnMode;
  SortType = SortType;
  rows = [];
  columns = [];
  currentMetric: Metric;
  enddate: Date;
  startdate: Date;
  loading: boolean = true;

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
    let width = this.timelineDiv.nativeElement.offsetWidth;
    let height = this.timelineDiv.nativeElement.offsetHeight;
    this.chart.width(width);
    this.chart.maxHeight(height);
  }

  private buildRows(measurements) {
    console.log(this.currentMetric)
    let data = [];
    this.channels.forEach((channel) => {
      const stationGroup = channel.networkCode + '.' + channel.stationCode;
      const channelData = [];

      measurements[channel.id][this.currentMetric.id].forEach(
       (measurement: Measurement, index) => {

        const dataPoint = {
          val: measurement.value,
          timeRange: [new Date(measurement.starttime), new Date(measurement.endtime)]
        }

          channelData.push(dataPoint);
        }
      );

      const channelRow = {
        label: channel.loc + '.' + channel.code,
        data: channelData
      };

      let stationRow = data.find(stationRow => stationRow.group === stationGroup);

      if(!stationRow) {
        data.push({
          group: stationGroup,
          data: []
        });
        stationRow = data.find(stationRow => stationRow.group === stationGroup);
      } 
        stationRow.data.push(channelRow)
      
    });
    
    this.loading = false;

    this.chart = TimelinesChart()(this.timelineDiv.nativeElement)
      .zDataLabel(this.currentMetric.unit)
      .zQualitative(false)
      .enableOverview(false);
    this.chart.zColorScale().range(["blue", "red"]);
    this.chart.zColorScale().domain([0, 1]);

    let formatTime = d3.timeFormat("%Y-%m-%d %-I:%M:%S %p");
    this.chart.segmentTooltipContent((d)=> {
      const row1 = "<div> value: <span>" + d.val + " (" +this.currentMetric.unit+")</span></div>";
      const row2 = "<div> start: <span>" +formatTime(d.timeRange[0]) + "</span></div>";
      const row3 = "<div> end: <span>" + formatTime(d.timeRange[1])+"</span></div>";
      return row1 + row2 + row3;
    });

    this.resize();
    this.chart.data(data);

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // checkThresholds(threshold, value): boolean {
  //   let withinThresholds = true;
  //   if (threshold.max && value != null && value > threshold.max) {
  //     withinThresholds = false;
  //   }
  //   if (threshold.min && value != null && value < threshold.min) {
  //     withinThresholds = false;
  //   }
  //   if (!threshold.min && !threshold.max) {
  //     withinThresholds = false;
  //   }
  //   return withinThresholds;
  // }

}
