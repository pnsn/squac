import { Component, OnInit, Input } from '@angular/core';
import { Metric } from '../../../../../shared/metric';
import { Channel } from '../../../../../shared/channel';

@Component({
  selector: 'tabular',
  templateUrl: './tabular.component.html',
  styleUrls: ['./tabular.component.scss']
})
export class TabularComponent implements OnInit {
  @Input() data : any;
  @Input() metrics : Metric[];
  @Input() channels : Channel[];
  
  constructor() { }

  ngOnInit() {

  }

  hasData(channelId, metricId): boolean {
    return this.data[channelId] && this.data[channelId][metricId];
  }

}
