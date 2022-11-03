import { TestBed } from "@angular/core/testing";
import { ViewService } from "@core/services/view.service";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { MeasurementService } from "./measurement.service";

describe("MeasurementService", () => {
  let measurementService: MeasurementService;

  beforeEach(() => {
    return MockBuilder(MeasurementService).mock(ViewService).mock(ApiService);
  });

  beforeEach(() => {
    measurementService = TestBed.inject(MeasurementService);
  });

  it("should be created", () => {
    expect(measurementService).toBeTruthy();
  });
});
