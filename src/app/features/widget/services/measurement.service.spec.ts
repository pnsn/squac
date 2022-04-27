import { TestBed } from "@angular/core/testing";
import { SquacApiService } from "@core/services/squacapi.service";
import { MeasurementService } from "./measurements.service";
import { ViewService } from "@core/services/view.service";
import { MockBuilder } from "ng-mocks";

describe("MeasurementService", () => {
  let measurementService: MeasurementService;

  beforeEach(() => {
    return MockBuilder(MeasurementService)
      .mock(SquacApiService)
      .mock(ViewService);
  });

  beforeEach(() => {
    measurementService = TestBed.inject(MeasurementService);
  });

  it("should be created", () => {
    expect(measurementService).toBeTruthy();
  });
});
