import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { Metric } from '../models/metric';

export class MockMetricsService {
  testMetric = new Metric(
    1,
    1,
    '',
    '',
    '',
    '',
    '',
    1,
    1
  );

  getMetrics = new BehaviorSubject<Metric[]>([]);

  getMetric(metricId: number): Observable<Metric> {
    return of(this.testMetric);
  }

  fetchMetrics(): void {
    this.getMetrics.next([this.testMetric]);
  }

  updateMetric(metric: Metric) {
    return of(metric);
  }
}
