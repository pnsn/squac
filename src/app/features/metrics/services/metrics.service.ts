import { Injectable } from '@angular/core';
import { Metric } from '@core/models/metric';
import { SquacApiService } from '@core/services/squacapi.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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
  // Squacapi route for data
  private url = 'measurement/metrics/';
  // Most recent set of metrics
  private localMetrics: Metric[] = [];
  metrics = new BehaviorSubject<Metric[]>([]);

  // Time stamp for last full metric data refresh
  lastRefresh: number;

  constructor(
    private squacApi: SquacApiService
  ) {}

  // Get all metrics available to user from squac
  getMetrics(): Observable<Metric[]> {

    // Request new data if > 5 minutes since last request
    if (this.lastRefresh && new Date().getTime() < this.lastRefresh + 5 * 60000) {
      console.log('return local metrics');
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

  // Get metric data with id from squac
  getMetric(id: number): Observable<Metric> {
    const index = this.localMetrics.findIndex(m => m.id === id);
    if (index > -1 && new Date().getTime() < this.lastRefresh + 5 * 60000) {
      return of(this.localMetrics[index]);
    }
    return this.squacApi.get(this.url, id).pipe(
      map(data => this.mapMetric(data))
    );
  }

  // Send metric to squac
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
    }
    return this.squacApi.post(this.url, postData).pipe(map(data => this.mapMetric(data)));
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
  }

  // Map Squac data to a Metric object
  private mapMetric(squacData): Metric {
    const metric = new Metric(
      squacData.id,
      squacData.user_id,
      squacData.name,
      squacData.code,
      squacData.description,
      squacData.reference_url,
      squacData.unit,
      squacData.sample_rate,
      squacData.default_minval,
      squacData.default_maxval
    );
    this.updateLocalMetrics(metric.id, metric);
    return metric;
  }
}
