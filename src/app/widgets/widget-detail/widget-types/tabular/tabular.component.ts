import { Component, OnInit, Input, ViewChild, EventEmitter, TemplateRef, OnDestroy } from '@angular/core';
import { Metric } from '../../../../shared/metric';
import { Channel } from '../../../../shared/channel';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { MeasurementPipe } from '../../../measurement.pipe';
import { Subject, Subscription } from 'rxjs';
import { DataFormatService } from 'src/app/widgets/data-format.service';
import { ViewService } from 'src/app/shared/view.service';

@Component({
  selector: 'app-tabular',
  templateUrl: './tabular.component.html',
  styleUrls: ['./tabular.component.scss'],
  providers: [MeasurementPipe]
})
export class TabularComponent implements OnInit, OnDestroy {
  @Input() metrics: Metric[];
  subscription = new Subscription();
  channels: Channel[];
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
    private measurement: MeasurementPipe,
    private viewService: ViewService,
    private dataFormatService : DataFormatService
  ) { }

  ngOnInit() {
    const dateFormatSub = this.dataFormatService.formattedData.subscribe(
      response => {
        if(response) {
          this.channels = this.viewService.getChannelGroup().channels;
          this.buildRows(response);
        }
      }
    );

    this.subscription.add(dateFormatSub);
    // this.subscription.add(this.resize.subscribe(reload => {
    //   console.log('reload!');
    //   this.columns = [...this.columns];
    //   this.table.recalculate();
    // }));
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
        const inThreshold = metric.threshold ? this.checkThresholds(metric.threshold, val) : false;

        if (metric.threshold && val != null && !inThreshold) {
          agg++;
        }

        rowMetrics[metric.id] = {
          value: val,
          classes: {
            'out-of-spec' : val !== null && !inThreshold && metric.threshold,
            'in-spec' : val !== null && inThreshold && metric.threshold,
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
          agg
          },
          ...rowMetrics
        }
        );
      } else {
        stationRows[staIndex] = this.findWorstChannel(row, stationRows[staIndex]);
        // check if agg if worse than current agg
      }

    });
    this.rows = [...stationRows, ...rows];
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
    this.subscription.unsubscribe();
  }

  getCellClass({ row, column, value }): any {
    return row[column.prop].classes;
  }

  // TODO: yes, this is bad boolean but I'm going to change it
  checkThresholds(threshold, value): boolean {
    let withinThresholds = true;
    if (threshold.max && value != null && value >= threshold.max) {
      withinThresholds = false;
    }
    if (threshold.min && value != null && value <= threshold.min) {
      withinThresholds = false;
    }
    if (!threshold.min && !threshold.max) {
      withinThresholds = false;
    }
    return withinThresholds;
  }

}
