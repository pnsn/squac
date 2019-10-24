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
  formattedData = {};
  dataReady: boolean = false;
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

  // //FIXME: This is awful, find a more efficient way
  // //get lastest for now
  // private buildRows(data) {
  //   this.channels.forEach(channel => {
  //     this.formattedData[channel.id] = {};
  //     this.metrics.forEach(metric => {
  //       this.formattedData[channel.id][metric.id]=this.measurement.transform(data[channel.id][metric.id], '');
  //     })
  //   });
  //   this.dataReady = true;
  // }

  private buildRows2(data){
    console.log(data);
    this.columns = [
      {prop:"agg", name: "Agg.", frozenLeft: true, width:"50"},
      {prop:"nslc", name: "Channels", frozenLeft: true}
    ];

    this.metrics.forEach(metric => {
      this.columns.push({
        prop:metric.id,
        name:metric.name,
        cellTemplate: this.metricTmpl,
        headerTemplate: this.hdrTpl
      });
    })
    
    this.rows = this.channels.map((channel, index)=>{
      let row = {};

      row['id'] = channel.id;
      row['net'] = channel.networkCode;
      row['sta'] = channel.stationCode;
      row['nslc'] = channel.nslc;

      let agg = 0;

      this.metrics.forEach(metric => {

        const val = this.measurement.transform(data[channel.id][metric.id], '');

        let inThreshold = this.checkThresholds(metric.threshold, val);

        if(val !=null && inThreshold) {
          agg++;
        }

        row[metric.id] = {
          value: val,
          classes: {
            'out-of-spec' : val !== null && !inThreshold ,
            'in-spec' : val !== null && inThreshold ,
            'has-threshold' : !!metric.threshold
          }
        };

      });
      row['agg'] = agg;
      return row;
    });
    this.dataReady = true;
    this.columns=[...this.columns];
    this.rows=[...this.rows];
  }

  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
    return false;
  }

  ngOnDestroy(): void {
    this.dataUpdate.unsubscribe();
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    
  }

  getCellClass({ row, column, value }): any {
    return row[column.name].classes;
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
