import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Metric } from '@core/models/metric';
import { testData } from './monitor-chart-test-data';

@Component({
  selector: 'app-monitor-chart',
  templateUrl: './monitor-chart.component.html',
  styleUrls: ['./monitor-chart.component.scss']
})
export class MonitorChartComponent implements OnInit {
  @Input() metric?: number;
  constructor() {
    this.results = testData;
   }
  results: Array<any>;
  hasData: boolean;

  xAxisLabel = 'Last Two Weeks';
  yAxisLabel: string;
  currentMetric: Metric;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  ngOnInit(): void {
    console.log(this.results)
    this.hasData = this.results.length > 0;
    // this.results = [
    //   {
    //     name: moment.utc(measurement.starttime).toDate(),
    //     value: measurement.value
    //   }
    // ]

    // this.results = [...this.results]
  }

  // this is functionally a widget - should have a measurement service?

  // ngOnChanges(changes: SimpleChanges): void {
  //   //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
  //   //Add '${implements OnChanges}' to the class.
  //   console.log(changes)
  // }
}