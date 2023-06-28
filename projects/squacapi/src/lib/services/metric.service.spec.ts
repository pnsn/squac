import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { MetricService } from "./metric.service";

describe("MetricService", () => {
  beforeEach(() => {
    return MockBuilder(MetricService, ApiService);
  });

  it("should be created", () => {
    const service: MetricService = TestBed.inject(MetricService);
    expect(service).toBeDefined();
  });
});
