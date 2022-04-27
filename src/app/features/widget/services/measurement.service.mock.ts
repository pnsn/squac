import { Widget } from "@features/widget/models/widget";
import { Subject } from "rxjs";
import { Measurement } from "../models/measurement";

export class MockMeasurementService {
  testMeasurement: Measurement = new Measurement(1, 1, 1, 1, 0, "", "");

  data = new Subject();

  setWidget(_widget: Widget) {
    return;
  }

  fetchMeasurements(_start: Date, _end: Date) {
    this.data.next({
      1: {
        1: [this.testMeasurement],
      },
    });
  }
}
