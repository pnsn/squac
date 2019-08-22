import { Injectable } from '@angular/core';
import { Metric } from './metric';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { SquacApiService } from '../squacapi';

interface MetricsHttpData {
  name: string, 
  description: string,
  url: string,
  unit: string,
  id?: number
}

@Injectable({
  providedIn: 'root'
})

export class MetricsService extends SquacApiService{
  getMetrics = new BehaviorSubject<Metric[]>([]);

  constructor(
    http : HttpClient
  ) {
    super("measurement/metrics/", http);
  }

  private updateMetrics(metrics: Metric[]) {
    this.getMetrics.next(metrics);
  };

  // Gets channel groups from server
  fetchMetrics() : void {
    //temp 
    super.get().pipe(
      map(
        results => {
          let metrics : Metric[] = [];

          results.forEach(m => {
            let metric = new Metric(
              m.id,
              m.name,
              m.description,
              m.source,
              m.unit
            )
            metrics.push(metric);
          });
          return metrics;
        }
      )
    )
    .subscribe(result => {
      this.updateMetrics(result);
    });
  }


  getMetric(id: number) : Observable<Metric>{
    //temp 
    return super.get(id).pipe(
      map(
        result => {
          let metric = new Metric(
              result.id,
              result.name,
              result.description,
              result.source,
              result.unit
          );
          return metric;
        }
      )
    );
  }

  updateMetric(metric: Metric) : Observable<Metric> {
    let postData : MetricsHttpData = {
      name: metric.name,
      description: metric.description,
      url : metric.source,
      unit : metric.unit
    }
    if(metric.id) {
      postData.id = metric.id;
    }
    return super.post(postData);
  }
}
