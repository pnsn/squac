import { Component, Input, OnInit } from '@angular/core';
import { Metric } from '@core/models/metric';

@Component({
  selector: 'app-alarm-chart',
  templateUrl: './alarm-chart.component.html',
  styleUrls: ['./alarm-chart.component.scss']
})
export class AlarmChartComponent implements OnInit {
  @Input() metric: Metric;
  constructor() { }

  ngOnInit(): void {
  }

}
