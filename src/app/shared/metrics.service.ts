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

export class MetricsService {
  getMetrics = new BehaviorSubject<Metric[]>([]);
  private url = "measurement/metrics/";

  constructor(
    private squacApi : SquacApiService
  ) {
  }

  private updateMetrics(metrics: Metric[]) {
    this.getMetrics.next(metrics);
  };

  // Gets channel groups from server
  fetchMetrics() : void {
    //temp 
    this.squacApi.get(this.url).pipe(
      map(
        results => {
          let metrics : Metric[] = [];

          results.forEach(m => {
            let metric = new Metric(
              m.id,
              m.name,
              m.description,
              m.url,
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
    return this.squacApi.get(this.url, id).pipe(
      map(
        result => {
          let metric = new Metric(
              result.id,
              result.name,
              result.description,
              result.url,
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
      url : metric.url,
      unit : metric.unit
    }
    if(metric.id) {
      postData.id = metric.id;
      return this.squacApi.put(this.url, metric.id, postData);
    } else {
      return this.squacApi.post(this.url, postData);
    }
  }
}
