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

  getMetric(metricId : number): Observable<Metric> {
    if( metricId === this.testMetric.id) {
      return of(this.testMetric);
    } else {
      return ;
    }
  }

  getMetrics = new BehaviorSubject<Metric[]>([
    this.testMetric
  ]);

  fetchMetrics() : void {
    this.getMetrics.next([this.testMetric]);
  }
}