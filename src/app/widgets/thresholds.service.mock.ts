import { Threshold } from './threshold';
import { Metric } from '../shared/metric';
import { Observable, of } from 'rxjs';


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
