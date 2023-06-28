import { TestBed } from "@angular/core/testing";
import { ChannelGroupService } from "../services/channel-group.service";
import { ChannelGroup } from "../models/channel-group";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { WidgetService } from "../services/widget.service";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";
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
