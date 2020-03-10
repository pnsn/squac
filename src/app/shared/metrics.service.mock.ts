import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { Metric } from './metric';

export class MockMetricsService {
  testMetric = new Metric(
    1,
    "",
    "",
    "",
    "",
    "",
    1,
    1
  );

  getMetric(metricId : number): Observable<Metric> {
    return of(this.testMetric);
  }

  getMetrics = new BehaviorSubject<Metric[]>([]);

  fetchMetrics() : void {
    this.getMetrics.next([this.testMetric]);
  }

  updateMetric(metric: Metric) {
    return of(metric);
  }
}