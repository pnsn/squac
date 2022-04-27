import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { SquacApiService } from "@core/services/squacapi.service";
import { MockSquacApiService } from "@core/services/squacapi.service.mock";
import { Dashboard } from "@dashboard/models/dashboard";

import { ChannelGroupService } from "@channelGroup/services/channel-group.service";
import { WidgetService } from "@widget/services/widget.service";
import { DashboardService } from "./dashboard.service";
import { MockChannelGroupService } from "@channelGroup/services/channel-group.service.mock";
import { MockWidgetService } from "@widget/services/widget.service.mock";

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

  const mockSquacApiService = new MockSquacApiService(testDashboard);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: SquacApiService, useValue: mockSquacApiService },
        { provide: ChannelGroupService, useClass: MockChannelGroupService },
        { provide: WidgetService, useClass: MockWidgetService },
      ],
    });

    dashboardService = TestBed.inject(DashboardService);
  });

  it("should be created", () => {
    const service: DashboardService = TestBed.inject(DashboardService);

    expect(service).toBeTruthy();
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
