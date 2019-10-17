import { Component, OnInit, Input } from '@angular/core';
import { Metric } from '../../../../../shared/metric';
import { Channel } from '../../../../../shared/channel';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-tabular',
  templateUrl: './tabular.component.html',
  styleUrls: ['./tabular.component.scss']
})
export class TabularComponent implements OnInit {
  @Input() data: any;
  @Input() metrics: Metric[];
  @Input() channels: Channel[];
  ColumnMode = ColumnMode;

  // rows = [];
  constructor() { }

  ngOnInit() {
    // this.buildRows();
  }



  hasData(channelId, metricId): boolean {
    return this.data[channelId] && this.data[channelId][metricId];
  }

}
