import { TestBed } from '@angular/core/testing';

import { ViewService } from './view.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';
import { DashboardsService } from '@features/dashboards/services/dashboards.service';
import { MockDashboardsService } from '@features/dashboards/services/dashboards.service.mock';
import { MockWidgetsService } from '@features/widgets/services/widgets.service.mock';
import { WidgetsService } from '@features/widgets/services/widgets.service';
import { AbilityModule } from '@casl/angular';
import { Ability } from '@casl/ability';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Widget } from '@features/widgets/models/widget';
import { Dashboard } from '@features/dashboards/models/dashboard';

describe('ViewService', () => {
  let service : ViewService;
  const abilityMock = {
    can: (permission, resource) => {
      return resource && resource.owner && resource.owner === 1;
    }
  }
  let testWidget = new Widget(
    1, 1, "name", "description", 1, 1, 2, 1, 1, 1, 1, []
  );

  let testDashboard = new Dashboard(
    1, 1, "name", "description", false, false, 1, [1]
  );
  // const mockSquacApiService = new MockSquacApiService( testMetric );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AbilityModule, MatSnackBarModule],
      providers: [{
        provide: DashboardsService, useClass: MockDashboardsService,
      },
      {provide: WidgetsService, useClass: MockWidgetsService},
      { provide: Ability, useValue: abilityMock}
    ]
    });
    service = TestBed.inject(ViewService);

  });
  it('should be created', () => {

    expect(service).toBeTruthy();
  });

  it('should set dashboard', ()=> {
    const dateSpy = spyOn(service, 'datesChanged');
    service.setDashboard(testDashboard);
    expect(dateSpy).toHaveBeenCalled();
  });

  it('should return update ability', ()=> {
    expect(service.canUpdate).toBeUndefined();
    service.setDashboard(testDashboard);
    expect(service.canUpdate).toBe(true);
  });

  it('should return live', ()=> {
    expect(service.isLive).toBeUndefined();
    service.setDashboard(testDashboard);
    expect(service.isLive).toBe(true);
  });

  it('should return range', ()=> {

  });

  it('should return start date', ()=> {

  });

  it('should return enddate', ()=> {

  });

  it('should send out widget id to resize', ()=> {

  });

  it('should emit resize to all widgets', () => {

  });

  it('should set the dashboard widgets', ()=> {

  });

  it('should return wdiget with id', ()=> {

  });

  it('should stop loading', ()=> {

  });

  it('should start loading', ()=> {

  });

  it('should send out new dates', ()=> {

  });

  it('should update given widget', ()=> {

  });


  it('should delete given widget', ()=> {

  });


  it('should refresh widgets', ()=> {

  });


  it('should delete dashboard', ()=> {

  });


  it('should save dashboard', ()=> {

  });

  
});
