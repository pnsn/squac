import { TestBed } from "@angular/core/testing";

import { SquacApiService } from "@core/services/squacapi.service";
import { MockSquacApiService } from "@core/services/squacapi.service.mock";
import { Dashboard, DashboardAdapter } from "@dashboard/models/dashboard";

import { ChannelGroupService } from "@channelGroup/services/channel-group.service";
import { WidgetService } from "@widget/services/widget.service";
import { DashboardService } from "./dashboard.service";
import { MockBuilder } from "ng-mocks";
import { DashboardModule } from "../dashboard.module";

describe("DashboardService", () => {
  let dashboardService: DashboardService;

  const testDashboard = new Dashboard(
    1,
    1,
    "name",
    "description",
    true,
    true,
    1,
    []
  );

  beforeEach(() => {
    return MockBuilder(DashboardService, DashboardModule)
      .provide({
        provide: SquacApiService,
        useValue: new MockSquacApiService(testDashboard),
      })
      .keep(DashboardAdapter)
      .mock(ChannelGroupService)
      .mock(WidgetService);
  });

  beforeEach(() => {
    dashboardService = TestBed.inject(DashboardService);
  });

  it("should be created", () => {
    expect(dashboardService).toBeTruthy();
  });

  it("should return dashboards", (done: DoneFn) => {
    dashboardService.getDashboards().subscribe((dashboards) => {
      expect(dashboards[0].id).toEqual(1);
      done();
    });
  });

  it("should get dashboard with id", (done: DoneFn) => {
    dashboardService.getDashboard(1).subscribe((dashboard) => {
      expect(dashboard.id).toEqual(testDashboard.id);
      done();
    });
  });

  it("should put dashboard with id", (done: DoneFn) => {
    dashboardService.updateDashboard(testDashboard).subscribe((dashboard) => {
      expect(dashboard.id).toEqual(testDashboard.id);
      done();
    });
  });

  it("should post dashboard without id", (done: DoneFn) => {
    dashboardService.updateDashboard(testDashboard).subscribe((dashboard) => {
      expect(dashboard.id).toEqual(testDashboard.id);
      done();
    });
  });

  it("should delete dashboard", (done: DoneFn) => {
    dashboardService.deleteDashboard(1).subscribe((response) => {
      expect(response).toBeTruthy();
      done();
    });
  });
});
