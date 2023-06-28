import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { MonitorService } from "./monitor.service";

describe("MonitorService", () => {
  beforeEach(() => {
    return MockBuilder(MonitorService, ApiService);
  });

  it("should be created", () => {
    const service = TestBed.inject(MonitorService);
    expect(service).toBeDefined();
  });
});
