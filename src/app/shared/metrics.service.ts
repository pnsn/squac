import { Injectable } from '@angular/core';
import { Metric } from './metric';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private metrics : Metric[] = [
    new Metric(1, "metric a", "metric a description", "source for a", "unit for a"),
    new Metric(2, "metric b", "metric b description", "source for b", "unit for b"),
    new Metric(3, "metric c", "metric c description", "source for c", "unit for c"),
  ]
  constructor() { }

  metricsChanged = new Subject<Metric[]>();

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


  //temp: just until JOn gets this db going
  private generateID() : number{
    return this.metrics.length + 1; 
  }

  //http this stuff
  addMetric(metric: Metric) : number{ //can't know id yet
    //make id
    let newMetric = new Metric(
      this.generateID(),
      metric.name,
      metric.description,
      metric.source,
      metric.unit
    )
    this.metrics.push(newMetric);
    this.metricsChange();

    return this.metrics.length; //return ID
  };

  //TODO: check if dangerous due to same group reference
  updateMetric(id: number, metric: Metric) : number{
    if(id) {
      let index = this.getIndexFromId(id);
      this.metrics[index] = metric; 
      this.metricsChange();
    } else {
      return this.addMetric(metric);
    }
    this.metricsChange();
  }

  private metricsChange(){
    this.metricsChanged.next(this.metrics.slice());
  }
}
