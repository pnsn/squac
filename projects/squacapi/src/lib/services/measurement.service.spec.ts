import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { MeasurementService } from "./measurement.service";

describe("MeasurementService", () => {
  beforeEach(() => {
    return MockBuilder(MeasurementService, ApiService);
  });

  it("should be created", () => {
    const measurementService = TestBed.inject(MeasurementService);
    expect(measurementService).toBeDefined();
  });
});
