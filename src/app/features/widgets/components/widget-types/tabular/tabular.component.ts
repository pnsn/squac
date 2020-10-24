
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { MeasurementPipe } from '@features/widgets/pipes/measurement.pipe';
import { Subscription } from 'rxjs';
import { ViewService } from '@core/services/view.service';
import { ChannelGroup } from '@core/models/channel-group';
import { Widget } from '@features/widgets/models/widget';
import { Metric } from '@core/models/metric';
import { Threshold } from '@features/widgets/models/threshold';
import { Channel } from '@core/models/channel';
@Component({
  selector: 'app-tabular',
  templateUrl: './tabular.component.html',
  styleUrls: ['./tabular.component.scss'],
  providers: [MeasurementPipe]
})
export class TabularComponent implements OnInit, OnDestroy {
  @Input() widget: Widget;
  @Input() data;

  metrics: Metric[];
  thresholds: {[metricId: number]: Threshold};
  channelGroup: ChannelGroup;

  channels: Channel[];

  subscription = new Subscription();

  @ViewChild('dataTable') table: any;
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
    private viewService: ViewService
  ) { }

  ngOnInit() {

    this.metrics = this.widget.metrics;
    this.thresholds = this.widget.thresholds;
    this.channelGroup = this.widget.channelGroup;
    if ( this.channelGroup) {
      this.channels = this.channelGroup.channels;
    }

    this.buildRows(this.data);

    const resizeSub = this.viewService.resize.subscribe(
      widgetId => {
        if(!widgetId || widgetId === this.widget.id) {
          this.resize();
        }
      }, error => {
        console.log('error in tabular resize: ' + error);
      }
    );

    this.subscription.add(resizeSub);
  }

  private resize() {
    setTimeout(()=>{
      this.table.recalculate();
    }, 500)


  }


  private findWorstChannel(channel, station) {
    if ( channel.agg > station.agg ) {
      const newStation = {...channel};
      newStation.treeStatus = station.treeStatus;
      newStation.id = station.id;
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
        const val = this.measurement.transform(data[channel.id][metric.id], this.widget.stattype.id);
        const threshold = this.thresholds[metric.id];
        const inThreshold = threshold ? this.checkThresholds(threshold, val) : false;

        if (threshold && val != null && !inThreshold) {
          agg++;
        }
        rowMetrics[metric.id] = {
          value: val,
          classes: {
            'out-of-spec' : val !== null && !inThreshold && !!threshold,
            'in-spec' : val !== null && inThreshold && !!threshold,
            'has-threshold' : !!threshold
          }
        };

      });
      const title = channel.networkCode + '.' + channel.stationCode + '.' + channel.loc + '.' + channel.code;
      let row = {
        title,
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
          title,
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
    if (threshold.max !== null && value !== null && value > threshold.max) {
      withinThresholds = false;
    }
    if (threshold.min !== null && value !== null && value < threshold.min) {
      withinThresholds = false;
    }

    // TODO: is no thresholds in or out
    if (threshold.min === null && threshold.max === null) {
      withinThresholds = false;
    }
    return withinThresholds;
  }

}
