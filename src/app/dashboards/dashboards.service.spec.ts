import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SquacApiService } from '../squacapi.service';
import { MockSquacApiService } from '../squacapi.service.mock';
import { Dashboard } from './dashboard';
import { Widget } from '../widgets/widget';
import { HttpClient } from '@angular/common/http';

import { ChannelGroupsService } from '../channel-groups/channel-groups.service';
import { WidgetsService } from '../widgets/widgets.service';
import { DashboardsService } from './dashboards.service';
import { Observable, of } from 'rxjs';
import { ChannelGroup } from '../shared/channel-group';
import { MockChannelGroupsService } from '../channel-groups/channel-groups.service.mock';
import { MockWidgetsService } from '../widgets/widgets.service.mock';

describe('DashboardsService', () => {
  let dashboardsService: DashboardsService;

  const testDashboard = {
    id: 1,
    name: 'name',
    description: 'description',
    group: 1
  };

  let squacApiService;

  let apiSpy;
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
      console.log(dashboard.id);
      expect(dashboard.id).toEqual(testDashboard.id);
      done();
    });
  });

  it('should put dashboard with id', () => {
    apiSpy = spyOn(squacApiService, 'put');

    dashboardsService.updateDashboard(new Dashboard(
      1,
      'name',
      'description',
      []
    ));

    expect(apiSpy).toHaveBeenCalled();
  });

  it('should post dashboard without id', () => {
    apiSpy = spyOn(squacApiService, 'post');

    const newDashboard = new Dashboard(
      null,
      'name',
      'description',
      [1]
    );

    dashboardsService.updateDashboard(newDashboard);

    expect(apiSpy).toHaveBeenCalled();
  });
});


