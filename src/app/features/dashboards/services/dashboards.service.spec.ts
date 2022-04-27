import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { SquacApiService } from "@core/services/squacapi.service";
import { MockSquacApiService } from "@core/services/squacapi.service.mock";
import { Dashboard } from "../models/dashboard";

import { ChannelGroupsService } from "@features/channel-groups/services/channel-groups.service";
import { WidgetsService } from "@features/widget/services/widgets.service";
import { DashboardsService } from "./dashboards.service";
import { MockChannelGroupsService } from "@features/channel-groups/services/channel-groups.service.mock";
import { MockWidgetsService } from "@features/widget/services/widgets.service.mock";

describe("DashboardsService", () => {
  let dashboardsService: DashboardsService;

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

  const mockSquacApiService = new MockSquacApiService(testDashboard);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: SquacApiService, useValue: mockSquacApiService },
        { provide: ChannelGroupsService, useClass: MockChannelGroupsService },
        { provide: WidgetsService, useClass: MockWidgetsService },
      ],
    });

    dashboardsService = TestBed.inject(DashboardsService);
  });

  it("should be created", () => {
    const service: DashboardsService = TestBed.inject(DashboardsService);

    expect(service).toBeTruthy();
  });

  it("should return dashboards", (done: DoneFn) => {
    dashboardsService.getDashboards().subscribe((dashboards) => {
      expect(dashboards[0].id).toEqual(1);
      done();
    });
  });

  it("should get dashboard with id", (done: DoneFn) => {
    dashboardsService.getDashboard(1).subscribe((dashboard) => {
      expect(dashboard.id).toEqual(testDashboard.id);
      done();
    });
  });

  it("should put dashboard with id", (done: DoneFn) => {
    dashboardsService.updateDashboard(testDashboard).subscribe((dashboard) => {
      expect(dashboard.id).toEqual(testDashboard.id);
      done();
    });
  });

  it("should post dashboard without id", (done: DoneFn) => {
    dashboardsService.updateDashboard(testDashboard).subscribe((dashboard) => {
      expect(dashboard.id).toEqual(testDashboard.id);
      done();
    });
  });

  it("should delete dashboard", (done: DoneFn) => {
    dashboardsService.deleteDashboard(1).subscribe((response) => {
      expect(response).toBeTruthy();
      done();
    });
  });
});
