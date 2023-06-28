import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { DashboardService } from "./dashboard.service";

describe("DashboardService", () => {
  beforeEach(() => {
    return MockBuilder(DashboardService, ApiService);
  });

  it("should be created", () => {
    const dashboardService = TestBed.inject(DashboardService);
    expect(dashboardService).toBeDefined();
  });
});
