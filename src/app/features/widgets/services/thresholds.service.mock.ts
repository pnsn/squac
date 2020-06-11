import { Observable, of } from 'rxjs';
import { Threshold } from '../models/threshold';
import { Metric } from 'src/app/core/models/metric';

export class MockThresholdsService {

  testThreshold: Threshold = new Threshold(
    1,
    1,
    1,
    1,
    0,
    1
  );

  updateThresholds(metrics: Metric[], thresholds: any, widgetId: number): Observable<Threshold>[] {
    return [of(this.testThreshold)];
  }
}
