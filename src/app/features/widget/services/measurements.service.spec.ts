import { TestBed } from "@angular/core/testing";
import { SquacApiService } from "@core/services/squacapi.service";
import { MeasurementsService } from "./measurements.service";
import { ViewService } from "@core/services/view.service";
import { MockBuilder } from "ng-mocks";

describe("MeasurementsService", () => {
  let measurementsService: MeasurementsService;

  beforeEach(() => {
    return MockBuilder(MeasurementsService)
      .mock(SquacApiService)
      .mock(ViewService);
  });

  beforeEach(() => {
    measurementsService = TestBed.inject(MeasurementsService);
  });

  it("should be created", () => {
    expect(measurementsService).toBeTruthy();
  });
});
