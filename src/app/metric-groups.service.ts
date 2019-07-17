import { Injectable } from '@angular/core';
import { Metric } from './shared/metric';
import { Subject } from 'rxjs';

//should I use index or id
@Injectable({
  providedIn: 'root'
})
export class MetricGroupsService {
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

  addMetric(metric: Metric) : number{ //can't know id yet
    this.metrics.push(new Metric(this.metrics.length, metric.name));
    this.metricsChange();

    return this.metrics.length;
  };

  updateMetric(id: number, metric: Metric) : number{
    if(id) {
      let index = this.getIndexFromId(id);
      this.metrics[index] = new Metric(id, metric.name);
      this.metricsChange();
    } else {
      return this.addMetric(metric);
    }

    console.log(this.metrics)
    this.metricsChange();
  }

  private metricsChange(){
    this.metricsChanged.next(this.metrics.slice());
  }
}
