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
import { take } from 'rxjs/operators';
import  * as moment from 'moment';
import { MessageService } from './message.service';
import { of } from 'rxjs';
describe('ViewService', () => {
  let service : ViewService;
  let widgetsService;
  let dashboardsService;
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
      providers: [
      {
        provide: DashboardsService, useClass: MockDashboardsService,
      },
      { 
        provide: WidgetsService, useClass: MockWidgetsService},
      { provide: Ability, useValue: abilityMock},
      { provide: MessageService, useValue: {
        message: (text) => {},
        error: (text) => {}
      }
    }
    ]
    });
    service = TestBed.inject(ViewService);
    widgetsService = TestBed.inject(WidgetsService);
    dashboardsService = TestBed.inject(DashboardsService);

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
    service.setDashboard(testDashboard);
    expect(service.range).toEqual(3);
  });

  it('should return start date', ()=> {
    service.setDashboard(testDashboard);
    expect(service.startdate).toBeDefined();
  });

  it('should return enddate', ()=> {
    service.setDashboard(testDashboard);
    expect(service.enddate).toBeDefined();
  });

  it('should send out widget id to resize', ()=> {
    service.resize.pipe(take(1)).subscribe(
      id => {
        expect(id).toEqual(1);        
      }
    );

    service.resizeWidget(1);
  });

  it('should emit resize to all widgets', () => {
    service.resize.pipe(take(1)).subscribe(
      id => {
        expect(id).toBeNull();        
      }
    );

    service.resizeAll();
  });

  it('should set the dashboard widgets', ()=> {
    service.setDashboard(testDashboard);
    service.setWidgets([testWidget]);

    expect(service.getWidget(1)).toEqual(testWidget);
  });

  it('should return wdiget with id', ()=> {
    service.setDashboard(testDashboard);
    service.setWidgets([]);
    expect(service.getWidget(1)).toEqual(false);
    service.setWidgets([testWidget]);

    expect(service.getWidget(1)).toEqual(testWidget);
  });

  it('should stop loading', ()=> {
    service.queuedWidgets = 1;
    service.widgetFinishedLoading();
    service.status.pipe(take(1)).subscribe(
      status => {
        expect(status).toEqual('finished');
      }
    );


  });

  it('should start loading', ()=> {
    service.queuedWidgets = 0;
    service.widgetStartedLoading();
    service.status.pipe(take(1)).subscribe(
      status => {
        expect(status).toEqual('loading');
      }
    );

  });

  it('should send out new dates', ()=> {
    service.setDashboard(testDashboard);
    const datesSpy = spyOn(service.dates, 'next');

    service.datesChanged(moment.utc(), moment.utc(), true);

    expect(datesSpy).toHaveBeenCalled();    
  });

  it('should update given widget', ()=> {
    const widgetSpy = spyOn(widgetsService, 'getWidget').and.returnValue(of(testWidget));
    service.setDashboard(testDashboard);
    service.setWidgets([testWidget]);
    service.updateWidget(1, testWidget);

    expect(widgetSpy).toHaveBeenCalled();
  });

  it('should add new widget', ()=> {
    const widgetSpy = spyOn(widgetsService, 'getWidget').and.returnValue(of(testWidget));
    service.setDashboard(testDashboard);
    service.setWidgets([]);
    service.updateWidget(1, testWidget);

    expect(widgetSpy).toHaveBeenCalled();
  });

  it('should remove the given widget if it exists', ()=> {

    service.setDashboard(testDashboard);
    service.setWidgets([testWidget]);
    service.updateWidget(1);

    service.currentWidgets.subscribe( widgets => {
      expect(widgets).toEqual([]);
    })
  });

  it('should delete given widget', ()=> {
    const widgetSpy = spyOn(widgetsService, 'deleteWidget').and.returnValue(of(true));
    service.setDashboard(testDashboard);
    service.setWidgets([testWidget]);

    service.deleteWidget(testWidget.id);
  
    expect(widgetSpy).toHaveBeenCalled();
  });


  it('should refresh widgets', ()=> {
    service.refresh.subscribe(
      value => {
        expect(value).toEqual("refresh");
      }
    )

    service.refreshWidgets();
  });


  it('should delete dashboard', ()=> {
    const dashSpy = spyOn(dashboardsService, 'deleteDashboard').and.returnValue(of(true));

    service.deleteDashboard(testDashboard.id);
  
    expect(dashSpy).toHaveBeenCalled();
  });


  it('should save dashboard', ()=> {

    service.setDashboard(testDashboard);
    const dashSpy = spyOn(dashboardsService, 'updateDashboard').and.returnValue(of(testDashboard));

    service.saveDashboard();
  
    expect(dashSpy).toHaveBeenCalled();
  });

  
});
