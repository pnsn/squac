import { Component, OnInit, Input } from '@angular/core';
import { Metric } from '../../../../../shared/metric';
import { Channel } from '../../../../../shared/channel';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { MeasurementPipe } from '../../../../measurement.pipe';

@Component({
  selector: 'app-tabular',
  templateUrl: './tabular.component.html',
  styleUrls: ['./tabular.component.scss'],
  providers: [MeasurementPipe]
})
export class TabularComponent implements OnInit {
  @Input() data: any;
  @Input() metrics: Metric[];
  @Input() channels: Channel[];
  ColumnMode = ColumnMode;
  formattedData = {};
  // rows = [];
  constructor(
    private measurement: MeasurementPipe
  ) { }

  ngOnInit() {
    if(this.data) {
      this.buildRows();
    }
  }

  //FIXME: This is awful, find a more efficient way
  private buildRows() {
    this.channels.forEach(channel => {
      this.formattedData[channel.id] = {};
      this.metrics.forEach(metric => {
        this.formattedData[channel.id][metric.id]=this.measurement.transform(this.data[channel.id][metric.id], 'average');
      })
    });
    console.log(this.formattedData)
  }
}
