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
    console.log("metricID", metricId)
    if( metricId === this.testMetric.id) {
      return of(this.testMetric);
    } else {
      return throwError('not found');
    }
  }

  getMetrics = new BehaviorSubject<Metric[]>([]);

  fetchMetrics() : void {
    this.getMetrics.next([this.testMetric]);
  }

  updateMetric(metric: Metric) {
    return of(metric);
  }
}