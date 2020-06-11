import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SquacApiService } from '../../core/services/squacapi.service';
import { MockSquacApiService } from '../../core/services/squacapi.service.mock';
import { Dashboard } from './dashboard';
import { Widget } from '../../core/models/widget';
import { HttpClient } from '@angular/common/http';

import { ChannelGroupsService } from '../channel-groups/services/channel-groups.service';
import { WidgetsService } from '../widgets/services/widgets.service';
import { DashboardsService } from './dashboards.service';
import { Observable, of } from 'rxjs';
import { ChannelGroup } from '../../core/models/channel-group';
import { MockChannelGroupsService } from '../channel-groups/services/channel-groups.service.mock';
import { MockWidgetsService } from '../widgets/services/widgets.service.mock';

describe('DashboardsService', () => {
  let dashboardsService: DashboardsService;

  const testDashboard = new Dashboard(
    1,
    1,
    'name',
    'description',
    true,
    []
  );

  let squacApiService;

  const mockSquacApiService = new MockSquacApiService( testDashboard );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: SquacApiService, useValue: mockSquacApiService},
        {provide: ChannelGroupsService, useClass: MockChannelGroupsService},
        {provide: WidgetsService, useClass: MockWidgetsService}
      ]
    });

    dashboardsService = TestBed.inject(DashboardsService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {
    const service: DashboardsService = TestBed.inject(DashboardsService);

    expect(service).toBeTruthy();
  });


  it('should fetch dashboards', (done: DoneFn) => {
    dashboardsService.fetchDashboards();

    dashboardsService.getDashboards.subscribe(dashboards => {
      expect(dashboards[0].id).toEqual(testDashboard.id);
      done();
    });

  });

  it('should return dashboards', () => {
    dashboardsService.getDashboards.subscribe(dashboards => {
      expect(dashboards).toBeTruthy();
    });
  });

  it('should get dashboard with id', (done: DoneFn) => {
    dashboardsService.getDashboard(1).subscribe(dashboard => {
      expect(dashboard.id).toEqual(testDashboard.id);
      done();
    });
  });

  it('should put dashboard with id', (done: DoneFn) => {
    dashboardsService.updateDashboard(testDashboard).subscribe(dashboard => {
      expect(dashboard.id).toEqual(testDashboard.id);
      done();
    });
  });

  it('should post dashboard without id', (done: DoneFn) => {
    const newDashboard = new Dashboard(
      null,
      null,
      'name',
      'description',
      true,
      [1]
    );

    dashboardsService.updateDashboard(testDashboard).subscribe(dashboard => {
      expect(dashboard.id).toEqual(testDashboard.id);
      done();
    });
  });
});


