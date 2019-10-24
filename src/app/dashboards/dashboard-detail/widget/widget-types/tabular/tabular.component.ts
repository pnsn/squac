import { Component, OnInit, Input, ViewChild, EventEmitter, TemplateRef } from '@angular/core';
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
export class TabularComponent implements OnInit {
  @Input() dataUpdate: Subject<any>;
  @Input() metrics: Metric[];
  @Input() channels: Channel[];
  @ViewChild('dataTable') table: any;
  @ViewChild('metricTmpl') metricTmpl: TemplateRef<any>;
  @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;
  ColumnMode = ColumnMode;
  SortType = SortType
  rows = [];
  columns=[];

  // rows = [];
  constructor(
    private measurement: MeasurementPipe
  ) { }

  ngOnInit() {
    console.log("subscribe")
    this.dataUpdate.subscribe(data =>{
      console.log("new data")
      // this.buildRows(data);
      this.buildRows2(data);
    });
  }

  private buildStationRows(data) {

  }

  private worstChannel(channels) {
    let worstChannel = [];
    return worstChannel;
  }

  private buildRows2(data){
    const rows = [];
    const stations = [];

    this.channels.forEach((channel, index)=>{
      const identifier = channel.networkCode+"."+channel.stationCode;


      let agg = 0;

      const rowMetrics = {};
      
      this.metrics.forEach(metric => {
        const val = this.measurement.transform(data[channel.id][metric.id], '');
        let inThreshold = this.checkThresholds(metric.threshold, val);

        if(val !=null && inThreshold) {
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
        title: channel.loc +"."+channel.code,
        id: channel.id,
        nslc: channel.nslc,
        parentId: identifier,
        treeStatus: "disabled",
        agg: agg
      };
      row = {...row, ...rowMetrics}
      if(!stations.includes(identifier)) {
        stations.push(identifier);
        rows.push(
          { 
            ...{
          title: channel.networkCode + "." + channel.stationCode,
          id: identifier,
          treeStatus: "collapsed",
          staCode: channel.stationCode,
          netCode: channel.networkCode,
          agg: agg
          },
          ...rowMetrics
        }
        )
      } else {
        //check if agg if worse than current agg
      }

      rows.push(row);
    });
    this.rows = [...rows];
    console.log(rows)
  }

  getChannelsForStation(stationId){
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
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    
  }

  getCellClass({ row, column, value }): any {
    return row[column.prop].classes;
  }

  //TODO: yes, this is bad boolean but I'm going to change it
  checkThresholds(threshold, value) : boolean {
    let withinThresholds = true;
    if(threshold.max && value != null && value > threshold.max) {
      withinThresholds = false;
    }
    if(threshold.min && value != null && value < threshold.min) {
      withinThresholds = false;
    }
    if(!threshold.min && !threshold.max) {
      withinThresholds = false;
    }
    return withinThresholds;
  }

}
