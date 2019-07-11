import { Injectable } from '@angular/core';
import { Metric } from './shared/metric';


//should I use index or id
@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  metrics: Metric[] = [
    { id: 1, name: "metric 1"},
    { id: 2, name: "metric 2"},
    { id: 3, name: "metric 3"}
  ]
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

  addMetric(metricName: String) { //can't know id yet

  };

  updateMetric(id: number) {
    let index = this.getIndexFromId(id);
    return this.metrics[index];
  }
}
