import { Observable, of, BehaviorSubject } from "rxjs";
import { Metric } from "@core/models/metric";

export class MockMetricsService {
  testMetric = new Metric(1, 1, "", "", "", "", "", 1, 1, 1);

  metrics = new BehaviorSubject<Metric[]>([]);

  getMetrics(metricId: number): Observable<Metric[]> {
    this.metrics.next([this.testMetric]);
    return of([this.testMetric]);
  }

  getMetric(): Observable<Metric> {
    return of(this.testMetric);
  }

  updateMetric(metric: Metric) {
    return of(metric);
  }
}
