import { TestBed } from '@angular/core/testing';

import { DashboardsService } from './dashboards.service';
import { Dashboard } from './dashboard';

describe('DashboardsService', () => {
  let httpClientSpy: { get: jasmine.Spy};
  let dashboardsService: DashboardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // imports: [HttpClientTestingModule]
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    dashboardsService = TestBed.get(DashboardsService);
  });

  // it('should be created', () => {
  //   const service: DashboardsService = TestBed.get(DashboardsService);
  //   expect(service).toBeTruthy();
  // });

  // it('should return dashboards', () => {
  //   expect(dashboardsService.getDashboards()).toBeTruthy();
  // });

  // it('should get dashboard from id', () => {
  //   expect(dashboardsService.getDashboard(1)).toBeTruthy();
  // });

  // it('should add new dashboard', () => {
  //   const testDashboard = new Dashboard(null, "dashboard a", "dashboard a description", []);

  //   const testID = dashboardsService.addDashboard(testDashboard);

  //   expect(dashboardsService.getDashboard(testID)).toBeTruthy();
  // });

  // it('should update existing dashboard', () => {
  //   const testDashboard = new Dashboard(1, "test", "dashboard a description", []);

  //   dashboardsService.updateDashboard(1, testDashboard);

  //   expect(dashboardsService.getDashboard(1).name).toEqual("test");
  // });

  // it('should add new channel group if no id', () => {
  //   const testDashboard = new Dashboard(null, "test", "dashboard a description", []);

  //   const testID = dashboardsService.updateDashboard(null, testDashboard);

  //   expect(dashboardsService.getDashboard(testID).name).toEqual("test");
  // });
});
