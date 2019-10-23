import { Component, OnInit, Input, ViewChild, EventEmitter } from '@angular/core';
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
  ColumnMode = ColumnMode;
  SortType = SortType
  formattedData = {};
  dataReady: boolean = false;
  rows = [];
  threshold = {
    min:1 ,
    max: 101,
    widget: 1,
    metric: 1
  };

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
    this.rows = this.channels.map((channel, index)=>{
      let row = {};

      row['id'] = channel.id;
      row['net'] = channel.networkCode;
      row['sta'] = channel.stationCode;
      row['nslc'] = channel.nslc;

      let agg = 0;

      this.metrics.forEach(metric => {
        const val = this.measurement.transform(data[channel.id][metric.id], '');

        let inThreshold = this.checkThresholds(metric, val);

        if(val !=null && inThreshold) {
          agg++;
        }

        row[metric.id] = {
          value: val,
          classes: {
            'out-of-spec' : val !== null && !inThreshold ,
            'in-spec' : val !== null && inThreshold ,
            'has-threshold' : !!this.threshold
          }
        };

      });
      row['agg'] = agg;
      return row;
    });
    console.log(this.rows);
    this.dataReady = true;
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
  checkThresholds(metric, value) : boolean {
    let withinThresholds = true;
    if(this.threshold.max && value != null && value > this.threshold.max) {
      withinThresholds = false;
    }
    if(this.threshold.min && value != null && value < this.threshold.min) {
      withinThresholds = false;
    }
    if(!this.threshold.min && !this.threshold.max) {
      withinThresholds = false;
    }
    return withinThresholds;
  }

}
