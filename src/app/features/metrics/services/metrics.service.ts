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
      console.log("return local metrics")
      return of(this.localMetrics);
    }
    return this.squacApi.get(this.url).pipe(
      map(
        results => {
          const metrics: Metric[] = [];

          results.forEach(m => {
            metrics.push(this.mapMetric(m));
          });
          return metrics;
        }
      ),
      tap(
        metrics => {
          this.lastRefresh = new Date().getTime();
          this.updateMetrics(metrics);
        }
      )
    );
  }


  getMetric(id: number): Observable<Metric> {
    const index = this.localMetrics.findIndex(m => m.id === id);
    if(index > -1 && new Date().getTime() < this.lastRefresh+ 5 * 60000) {
      return of(this.localMetrics[index]);
    }
    return this.squacApi.get(this.url, id).pipe(
      map(data => this.mapMetric(data))
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
      return this.squacApi.put(this.url, metric.id, postData).pipe(
        map(data => this.mapMetric(data))
      );
    } else {
      return this.squacApi.post(this.url, postData).pipe(map(data => this.mapMetric(data)));
    }
  }

  private updateLocalMetrics(id: number, metric?: Metric) {
    const index = this.localMetrics.findIndex(d => d.id === id);

    if (index > -1) {
      if (metric) {
        this.localMetrics[index] = metric;

      } else {
        this.localMetrics.splice(index, 1);
      }
    } else {
      this.localMetrics.push(metric);
    }
  }

  private mapMetric(squacData) : Metric {
    const metric = new Metric(
      squacData.id,
      squacData.user_id,
      squacData.name,
      squacData.code,
      squacData.description,
      squacData.reference_url,
      squacData.unit,
      squacData.default_minval,
      squacData.default_maxval
    );
    this.updateLocalMetrics(metric.id, metric);
    return metric;
  }
}
