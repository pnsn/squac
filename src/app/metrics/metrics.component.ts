import { Component, OnInit } from '@angular/core';
import { Metric } from '../shared/metric';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {
  metrics: Metric[] = [
    { id: 1, name: "metric 1"},
    { id: 2, name: "metric 2"},
    { id: 3, name: "metric 3"}
  ]
  constructor() { }

  ngOnInit() {
  }

}
