import { Component, OnInit, Input, ViewChild, EventEmitter, TemplateRef, OnDestroy } from '@angular/core';
import { Metric } from '../../../../../shared/metric';
import { Channel } from '../../../../../shared/channel';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { MeasurementPipe } from '../../../../measurement.pipe';
import { Subject } from 'rxjs';

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
  @Input() startdate: string;
  @Input() enddate: string;
  @ViewChild('dataTable', { static: false }) table: any;
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
    this.dataUpdate.subscribe(data => {
      this.currentMetric = this.metrics[0];
      console.log(this.currentMetric)
      this.buildRows(data);
    });
  }

  private findWorstChannel(channel, station) {
    if ( channel.agg > station.agg ) {
      const newStation = {...channel};
      newStation.treeStatus = station.treeStatus;
      newStation.id = station.id;
      newStation.title = station.title;
      newStation.parentId = null;
      return newStation;
    }
    return  station;
  }

  private buildRows(data) {
    const rows = [];
    const stations = [];
    const stationRows = [];
    this.channels.forEach((channel, index) => {
      const identifier = channel.networkCode + '.' + channel.stationCode;
      const inSpec = [];
      const outOfSpec = [];

      let agg = 0;

      const rowMetrics = {};

      data[channel.id][this.currentMetric.id].forEach(
        measurement => {
          if(this.checkThresholds(this.currentMetric.threshold, measurement.value)){
            inSpec.push({
              "starting_time": new Date(measurement.starttime), "ending_time": new Date(measurement.endtime)
            });
          } else {
            outOfSpec.push({
              "starting_time": new Date(measurement.starttime), "ending_time": new Date(measurement.endtime)
            });
          }
        }
      );

      const chartData = [{ 
        class: "out-of-spec",
        label: "Out of spec",
        times: outOfSpec
      },
        {
          class: "in-spec",
          label: "In spec", 
          times: inSpec
        }
      ];

      let row = {
        title: channel.loc + '.' + channel.code,
        id: channel.id,
        nslc: channel.nslc,
        parentId: identifier,
        treeStatus: 'disabled',
        chartData: chartData
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
            chartData: chartData
          },
        }
        );
      } 
      // else {
      //   const staIndex = stations.indexOf(identifier);
      //   stationRows[staIndex] = this.findWorstChannel(row, stationRows[staIndex]);
      //   // check if agg if worse than current agg
      // }

      rows.push(row)
    });

    this.rows = [...stationRows, ...rows];
    console.log(this.rows)
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
    this.dataUpdate.unsubscribe();
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