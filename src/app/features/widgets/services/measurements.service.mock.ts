import { Widget } from '@features/widgets/models/widget';
import { Subject } from 'rxjs';
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

  data = new Subject();

  setWidget(widget: Widget) {
    return;
  }

  fetchMeasurements(start: Date, end: Date) {
    this.data.next(
      { 1 :
        {
         1 : [this.testMeasurement]
        }
       }
    );
  }


}
