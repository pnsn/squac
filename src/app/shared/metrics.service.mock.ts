import { Observable, of, BehaviorSubject } from 'rxjs';
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

  getMetric(metricId : number): Observable<any> {
    if( metricId === 1) {
      return of(this.testMetric);
    } else {
      return of(false);
    }
  }

  getMetrics = new BehaviorSubject<Metric[]>([
    this.testMetric
  ]);

  fetchMetrics() : void {
    this.getMetrics.next([this.testMetric]);
  }
}