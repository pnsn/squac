import { Injectable } from '@angular/core';
import { Metric } from '@core/models/metric';
import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { SquacApiService } from '@core/services/squacapi.service';

interface MetricsHttpData {
  name: string;
  code: string;
  description: string;
  unit: string;
  reference_url: string;
  default_minval?: number;
  default_maxval?: number;
  id?: number;
}

@Injectable({
  providedIn: 'root'
})

export class MetricsService {
  metrics = new BehaviorSubject<Metric[]>([]);
  lastRefresh : number;
  private url = 'measurement/metrics/';
  localMetrics : Metric[] = [];
  constructor(
    private squacApi: SquacApiService
  ) {
  }

  private updateMetrics(metrics: Metric[]) {
    this.metrics.next(metrics);
  }

  // Gets channel groups from server
  getMetrics(): Observable<Metric[]> {
    if(this.lastRefresh && new Date().getTime() < this.lastRefresh+ 5 * 60000) {
      console.log("return local dashboards")
      return of(this.localMetrics);
    }
    return this.squacApi.get(this.url).pipe(
      map(
        results => {
          const metrics: Metric[] = [];

          results.forEach(m => {
            const metric = new Metric(
              m.id,
              m.owner,
              m.name,
              m.code,
              m.description,
              m.url,
              m.unit,
              m.default_minval,
              m.default_maxval
            );
            metrics.push(metric);
          });
          return metrics;
        }
      ),
      tap(
        metrics => {
          this.localMetrics = metrics;
          this.lastRefresh = new Date().getTime();
          this.updateMetrics(metrics);
        }
      )
    );
  }


  getMetric(id: number): Observable<Metric> {
    // temp
    return this.squacApi.get(this.url, id).pipe(
      map(
        result => {
          const metric = new Metric(
              result.id,
              result.user_id,
              result.name,
              result.code,
              result.description,
              result.reference_url,
              result.unit,
              result.default_minval,
              result.default_maxval
          );
          return metric;
        }
      )
    );
  }

  updateMetric(metric: Metric): Observable<Metric> {
    const postData: MetricsHttpData = {
      name: metric.name,
      code: metric.code,
      description: metric.description,
      reference_url: metric.refUrl,
      unit : metric.unit,
      default_minval : metric.minVal,
      default_maxval : metric.maxVal
    };
    if (metric.id) {
      postData.id = metric.id;
      return this.squacApi.put(this.url, metric.id, postData);
    } else {
      return this.squacApi.post(this.url, postData);
    }
  }
}
