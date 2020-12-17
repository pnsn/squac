import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Metric } from '@core/models/metric';

@Component({
  selector: 'app-alarm-chart',
  templateUrl: './alarm-chart.component.html',
  styleUrls: ['./alarm-chart.component.scss']
})
export class AlarmChartComponent implements OnInit {
  @Input() metric?: Metric;
  constructor() { }

  ngOnInit(): void {
    console.log(this.metric)
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
  //   //Add '${implements OnChanges}' to the class.
  //   console.log(changes)
  // }
}
