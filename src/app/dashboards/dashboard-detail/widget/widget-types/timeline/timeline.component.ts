import { Component, OnInit, Input, ViewChild, EventEmitter, TemplateRef, OnDestroy } from '@angular/core';
import { Metric } from '../../../../../shared/metric';
import { Channel } from '../../../../../shared/channel';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { MeasurementPipe } from '../../../../measurement.pipe';
import { Subject, Subscription } from 'rxjs';
import { Measurement } from 'src/app/dashboards/measurement';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  providers: [MeasurementPipe]
})
export class TimelineComponent implements OnInit, OnDestroy {
  @Input() dataUpdate: Subject<any>;
  @Input() metrics: Metric[];
  @Input() channels: Channel[];
  @Input() startdate: Date;
  @Input() enddate: Date;
  @ViewChild('dataTable', { static: false }) table: any;
  @Input() resize: Subject<boolean>;
  subscription = new Subscription();
  ColumnMode = ColumnMode;
  SortType = SortType;
  rows = [];
  columns = [];
  currentMetric;

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
    private measurement: MeasurementPipe
  ) { }

  ngOnInit() {
    this.subscription.add(this.dataUpdate.subscribe(data => {
      this.currentMetric = this.metrics[0];
      console.log(this.currentMetric)
      this.buildRows(data);
    }));


    this.subscription.add(this.resize.subscribe(reload => {
      this.table.recalculate();
    }));
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
    const starttimeInSec =this.startdate.getTime()/1000;
    const endtimeInSec = this.enddate.getTime()/1000;

    this.channels.forEach((channel, index) => {
      const identifier = channel.networkCode + '.' + channel.stationCode;
      const timeline = [];

      let agg = 0;

      let isBad = false;

      data[channel.id][this.currentMetric.id].forEach(
       (measurement : Measurement, index) => {
          const start = new Date(measurement.starttime).getTime() / 1000;
          const end = new Date(measurement.endtime).getTime() / 1000;
          const inThreshold = this.checkThresholds(this.currentMetric.threshold, measurement.value);
          timeline.push(
            
            {
              end: (end - starttimeInSec)/(endtimeInSec - starttimeInSec),
              styles: {
                'width' : (end - start) / (endtimeInSec - starttimeInSec) * 100 + "%",
                'left' : (start - starttimeInSec)/(endtimeInSec - starttimeInSec) * 100 + '%'
              },
              info: measurement.starttime + " " + measurement.endtime + " " + measurement.value,
              threshold: inThreshold
            }
          );
          
          if(index == 0 && !inThreshold) {
            isBad = true;
          }
        }
      );
      let row = {
        title: channel.loc + '.' + channel.code,
        id: channel.id,
        nslc: channel.nslc,
        parentId: identifier,
        treeStatus: 'disabled',
        timeline: timeline
      };

      if (!stations.includes(identifier)) {
        stations.push(identifier);
        stationRows.push(
          {
            ...{
            title: channel.networkCode + '.' + channel.stationCode,
            id: identifier,
            treeStatus: 'collapsed',
            staCode: channel.stationCode,
            netCode: channel.networkCode,
            timeline: timeline
          },
        }
        );
      } 
      else {
        if(isBad) {
          const staIndex = stations.indexOf(identifier);
          stationRows[staIndex] = this.replaceChannel(row, stationRows[staIndex]);
        }

        // check if agg if worse than current agg
      }

      rows.push(row)
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

  // TODO: yes, this is bad boolean but I'm going to change it
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