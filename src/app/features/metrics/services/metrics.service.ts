import { Injectable } from '@angular/core';
import { Metric, MetricAdapter } from '@core/models/metric';
import { SquacApiService } from '@core/services/squacapi.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})

export class MetricsService {
  // Squacapi route for data
  private url = 'measurement/metrics/';
  // Most recent set of metrics
  private localMetrics: Metric[] = [];
  metrics = new BehaviorSubject<Metric[]>([]);

  // Time stamp for last full metric data refresh
  lastRefresh: number;

  constructor(
    private squacApi: SquacApiService,
    private metricAdapter: MetricAdapter
  ) {}

  // Get all metrics available to user from squac
  getMetrics(): Observable<Metric[]> {

    // Request new data if > 5 minutes since last request
    if (this.lastRefresh && new Date().getTime() < this.lastRefresh + 5 * 60000) {
      return of(this.localMetrics);
    }
    return this.squacApi.get(this.url).pipe(
      map( results => results.map(
        r => {
          const metric = this.metricAdapter.adaptFromApi(r);
          this.updateLocalMetrics(metric.id, metric);
          return metric;
        })),
      tap(
        metrics => {
          this.lastRefresh = new Date().getTime();
          this.updateMetrics(metrics);
        }
      )
    );
  }

  // Get metric data with id from squac
  getMetric(id: number): Observable<Metric> {
    const index = this.localMetrics.findIndex(m => m.id === id);
    if (index > -1 && new Date().getTime() < this.lastRefresh + 5 * 60000) {
      return of(this.localMetrics[index]);
    }
    return this.squacApi.get(this.url, id).pipe(
      map(data => this.metricAdapter.adaptFromApi(data)),
      tap( metric => this.updateLocalMetrics(metric.id, metric))
    );
  }

  // Send metric to squac
  updateMetric(metric: Metric): Observable<Metric> {
    const postData = this.metricAdapter.adaptToApi(metric);
    if (metric.id) {
      return this.squacApi.put(this.url, metric.id, postData).pipe(
        map(data => this.metricAdapter.adaptFromApi(data)),
        tap(m => this.updateLocalMetrics(m.id, m))
      );
    }
    return this.squacApi.post(this.url, postData).pipe(
      map(data => this.metricAdapter.adaptFromApi(data)),
      tap( m => this.updateLocalMetrics(m.id, m))
    );
  }

  // Update metrics to subscribers
  private updateMetrics(metrics: Metric[]) {
    this.metrics.next(metrics);
  }

  // Save/update/delete a metric from the local storage
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
    this.lastRefresh = null;
  }
}
