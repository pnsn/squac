import { Component, OnInit, Input, ViewChild, EventEmitter, TemplateRef, OnDestroy } from '@angular/core';
import { Metric } from '../../../../../shared/metric';
import { Channel } from '../../../../../shared/channel';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { MeasurementPipe } from '../../../../measurement.pipe';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tabular',
  templateUrl: './tabular.component.html',
  styleUrls: ['./tabular.component.scss'],
  providers: [MeasurementPipe]
})
export class TabularComponent implements OnInit, OnDestroy {
  @Input() dataUpdate: Subject<any>;
  @Input() metrics: Metric[];
  @Input() channels: Channel[];
  @ViewChild('dataTable', { static: false }) table: any;
  ColumnMode = ColumnMode;
  SortType = SortType;
  rows = [];
  columns = [];
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
      this.buildRows(data);
    });
  }

  private buildStationRows(data) {

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


      let agg = 0;

      const rowMetrics = {};

      this.metrics.forEach(metric => {
        const val = this.measurement.transform(data[channel.id][metric.id], '');
        const inThreshold = this.checkThresholds(metric.threshold, val);

        if (val != null && !inThreshold) {
          agg++;
        }

        rowMetrics[metric.id] = {
          value: val,
          classes: {
            'out-of-spec' : val !== null && !inThreshold ,
            'in-spec' : val !== null && inThreshold ,
            'has-threshold' : !!metric.threshold
          }
        };

      });

      let row = {
        title: channel.loc + '.' + channel.code,
        id: channel.id,
        nslc: channel.nslc,
        parentId: identifier,
        treeStatus: 'disabled',
        agg
      };
      row = {...row, ...rowMetrics};
      rows.push(row);
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
          agg
          },
          ...rowMetrics
        }
        );
      } else {
        const staIndex = stations.indexOf(identifier);
        stationRows[staIndex] = this.findWorstChannel(row, stationRows[staIndex]);
        // check if agg if worse than current agg
      }

    });
    this.rows = [...stationRows, ...rows];
    console.log(stationRows)
    console.log(rows)
  }

  getChannelsForStation(stationId) {
    return [];
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
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.

  }

  getCellClass({ row, column, value }): any {
    return row[column.prop].classes;
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
