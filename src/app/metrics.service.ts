import { Injectable } from '@angular/core';
import { Metric } from './shared/metric';
import { Subject } from 'rxjs';

//should I use index or id
@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private metrics: Metric[] = [
    new Metric(1, "metric a"),
    new Metric(2, "metric b"), 
    new Metric(3, "metric c") 
  ];
  metricsChanged = new Subject<Metric[]>();
  //in future get metrics from request;
  constructor() { }

  private getIndexFromId(id: number) : number{
    for (let i=0; i < this.metrics.length; i++) {
      if (this.metrics[i].id === id) {
          return i;
      }
    }
  }

  getMetrics(){
    return this.metrics.slice();
  }

  getMetric(id: number) : Metric{
    let index = this.getIndexFromId(id);
    return this.metrics[index];
  }

  addMetric(name: String) { //can't know id yet
  this.metricsChange();
  };

  updateMetric(id: number, metric: Metric) {
    let index = this.getIndexFromId(id);

    this.metrics[index] = new Metric(id, metric.name);
    console.log(this.metrics)
    this.metricsChange();
  }

  private metricsChange(){
    this.metricsChanged.next(this.metrics.slice());
  }
}
