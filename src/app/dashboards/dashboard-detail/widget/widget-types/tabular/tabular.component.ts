import { Component, OnInit, Input, ViewChild, EventEmitter } from '@angular/core';
import { Metric } from '../../../../../shared/metric';
import { Channel } from '../../../../../shared/channel';
import { ColumnMode } from '@swimlane/ngx-datatable';
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
  formattedData = {};
  dataReady: boolean = false;
  // rows = [];
  constructor(
    private measurement: MeasurementPipe
  ) { }

  ngOnInit() {
    console.log("subscribe")
    this.dataUpdate.subscribe(data =>{
      console.log("new data")
      this.buildRows(data)
    });
  }

  //FIXME: This is awful, find a more efficient way
  private buildRows(data) {
    console.log("build rows")
    this.channels.forEach(channel => {
      this.formattedData[channel.id] = {};
      this.metrics.forEach(metric => {
        this.formattedData[channel.id][metric.id]=this.measurement.transform(data[channel.id][metric.id], 'average');
      })
    });
    this.channels=[...this.channels];
    console.log(this.metrics)
    this.metrics=[...this.metrics];
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


}
