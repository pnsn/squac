import { TestBed } from "@angular/core/testing";
import { ChannelGroupService } from "../services/channel-group.service";
import { ChannelGroup } from "../models/channel-group";
import { DashboardAdapter } from "../models/dashboard";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { WidgetService } from "../services/widget.service";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";
import { DashboardService } from "./dashboard.service";

describe("DashboardService", () => {
  let dashboardService: DashboardService;

  const testChannelGroup = new ChannelGroup();

  beforeEach(() => {
    return MockBuilder(DashboardService)
      .keep(DashboardAdapter)
      .provide({
        provide: ChannelGroupService,
        useValue: {
          getChannelGroup: () => {
            return of(testChannelGroup);
          },
        },
      })
      .mock(ApiService)
      .mock(WidgetService);
  });

  beforeEach(() => {
    dashboardService = TestBed.inject(DashboardService);
  });

  it("should be created", () => {
    expect(dashboardService).toBeTruthy();
  });

  // it("should return dashboards", (done: DoneFn) => {
  //   dashboardService.getDashboards().subscribe((dashboards) => {
  //     expect(dashboards[0].id).toEqual(1);
  //     done();
  //   });
  // });

  // it("should get dashboard with id", (done: DoneFn) => {
  //   dashboardService.getDashboard(1).subscribe((dashboard) => {
  //     expect(dashboard.id).toEqual(testDashboard.id);
  //     done();
  //   });
  // });

  // it("should put dashboard with id", (done: DoneFn) => {
  //   dashboardService.updateDashboard(testDashboard).subscribe((dashboard) => {
  //     expect(dashboard.id).toEqual(testDashboard.id);
  //     done();
  //   });
  // });

  // it("should post dashboard without id", (done: DoneFn) => {
  //   dashboardService.updateDashboard(testDashboard).subscribe((dashboard) => {
  //     expect(dashboard.id).toEqual(testDashboard.id);
  //     done();
  //   });
  // });

  // it("should delete dashboard", (done: DoneFn) => {
  //   dashboardService.deleteDashboard(1).subscribe((response) => {
  //     expect(response).toBeTruthy();
  //     done();
  //   });
  // });
});