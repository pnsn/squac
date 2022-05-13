import { TestBed } from "@angular/core/testing";
import { SquacApiService } from "@core/services/squacapi.service";
import { MeasurementService } from "./measurement.service";
import { ViewService } from "@core/services/view.service";
import { MockBuilder } from "ng-mocks";
import { MockSquacApiService } from "@core/services/squacapi.service.mock";

describe("MeasurementService", () => {
  let measurementService: MeasurementService;

  beforeEach(() => {
    return MockBuilder(MeasurementService)
      .provide({ provide: SquacApiService, useValue: MockSquacApiService })
      .mock(ViewService);
  });

  beforeEach(() => {
    measurementService = TestBed.inject(MeasurementService);
  });

  it("should be created", () => {
    expect(measurementService).toBeTruthy();
  });
});
