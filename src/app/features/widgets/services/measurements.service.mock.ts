import { Widget } from '../../../core/models/widget';
import { Observable, of } from 'rxjs';
import { Measurement } from '../models/measurement';


export class MockMeasurementsService {
  testMeasurement: Measurement = new Measurement(
    1,
    1,
    1,
    1,
    0,
    new Date(),
    new Date ()
  );

  getMeasurements(widget: Widget, start: Date, end: Date ): Observable<any> {
    return of(
      { 1 :
       {
        1 : [this.testMeasurement]
      }
      }
    );
  }


}
