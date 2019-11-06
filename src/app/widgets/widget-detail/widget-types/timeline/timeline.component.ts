import { Component, OnInit, Input, ViewChild, EventEmitter, TemplateRef, OnDestroy } from '@angular/core';
import { Metric } from '../../../../shared/metric';
import { Channel } from '../../../../shared/channel';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { MeasurementPipe } from '../../../measurement.pipe';
import { Subject, Subscription } from 'rxjs';
import { Measurement } from 'src/app/widgets/measurement';
import { DataFormatService } from 'src/app/widgets/data-format.service';
import { ViewService } from 'src/app/shared/view.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  providers: [MeasurementPipe]
})
export class TimelineComponent implements OnInit, OnDestroy {
  @Input() metrics: Metric[];
  @ViewChild('dataTable', { static: false }) table: any;
  @Input() resize: Subject<boolean>;
  subscription = new Subscription();
  channels: Channel[];
  ColumnMode = ColumnMode;
  SortType = SortType;
  rows = [];
  columns = [];
  currentMetric : Metric;
  enddate : Date;
  startdate : Date;

  //get start date and end date
  messages = {
      // Message to show when array is presented
  // but contains no values
    emptyMessage: 'Loading data.',

    // Footer total message
    totalMessage: 'total',

    // Footer selected message
    selectedMessage: 'selected'
  };

  // rows = [];
  constructor(
    private dataFormatService : DataFormatService,
    private viewService : ViewService,
    private measurement: MeasurementPipe
  ) { }

  ngOnInit() {
    this.dataFormatService.formattedData.subscribe(
      response => {
        if(response) {
          this.channels = this.viewService.getChannelGroup().channels;
          this.startdate = this.viewService.getStartdate();
          this.enddate = this.viewService.getEnddate();

          this.currentMetric = this.metrics[0]; //TODO: get this a diffetent way
          this.buildRows(response);
        }
      }
    );
        // this.
    // this.subscription.add(this.dataUpdate.subscribe(data => {
    //   this.currentMetric = this.metrics[0];
    //   this.buildRows(data);
    // }));


    // this.subscription.add(this.resize.subscribe(reload => {
    //   this.table.recalculate();
    // }));
  }

  private replaceChannel(channel, station) {
    const newStation = {...channel};
    newStation.treeStatus = station.treeStatus;
    newStation.id = station.id;
    newStation.title = station.title;
    newStation.parentId = null;
    return newStation;
  }

  private buildRows(data) {
    const rows = [];
    const stations = [];
    const stationRows = [];
    const starttimeInSec = this.startdate.getTime() / 1000;
    const endtimeInSec = this.enddate.getTime() / 1000;
    const rangeInSec = endtimeInSec - starttimeInSec;
    this.channels.forEach((channel) => {
      const identifier = channel.networkCode + '.' + channel.stationCode;
      const timeline = [];

      const agg = 0;

      let isBad = false;
      console.log(this.currentMetric)
      data[channel.id][this.currentMetric.id].forEach(
       (measurement: Measurement, index) => {
          const start = new Date(measurement.starttime).getTime() / 1000;
          const end = new Date(measurement.endtime).getTime() / 1000;
          const inThreshold = this.currentMetric.threshold ? this.checkThresholds(this.currentMetric.threshold, measurement. value) : false;
          timeline.push(

            {
              end: (end - starttimeInSec) / rangeInSec,
              styles: {
                width : (end - start) / rangeInSec * 100 + '%',
                left : (start - starttimeInSec) / rangeInSec * 100 + '%'
              },
              info: measurement.starttime + ' ' + measurement.endtime + ' ' + measurement.value,
              threshold: inThreshold
            }
          );
          if (index === 0 && !inThreshold && this.currentMetric.threshold) {
            isBad = true;
          }
        }
      );
      const row = {
        title: channel.loc + '.' + channel.code,
        id: channel.id,
        nslc: channel.nslc,
        parentId: identifier,
        treeStatus: 'disabled',
        timeline
      };

      const staIndex = stations.indexOf(identifier);
      if (staIndex < 0) {
        stations.push(identifier);
        stationRows.push(
          {
            ...{
              title: channel.networkCode + '.' + channel.stationCode,
              id: identifier,
              treeStatus: 'collapsed',
              staCode: channel.stationCode,
              netCode: channel.networkCode,
              timeline
            },
          }
        );
      } else if (isBad || stationRows[staIndex].timeline.length === 0) {
        stationRows[staIndex] = this.replaceChannel(row, stationRows[staIndex]);
      }
      rows.push(row);
    });

    this.rows = [...stationRows, ...rows];
  }

  onTreeAction(event: any) {
    const index = event.rowIndex;
    const row = event.row;
    if (row.treeStatus === 'collapsed') {
      row.treeStatus = 'loading';
      row.treeStatus = 'expanded';
      this.rows = [...this.rows];
    } else {
      row.treeStatus = 'collapsed';
      this.rows = [...this.rows];
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // // TODO: yes, this is bad boolean but I'm going to change it
  checkThresholds(threshold, value): boolean {
    let withinThresholds = true;
    if (threshold.max && value != null && value > threshold.max) {
      withinThresholds = false;
    }
    if (threshold.min && value != null && value < threshold.min) {
      withinThresholds = false;
    }
    if (!threshold.min && !threshold.max) {
      withinThresholds = false;
    }
    return withinThresholds;
  }

}
