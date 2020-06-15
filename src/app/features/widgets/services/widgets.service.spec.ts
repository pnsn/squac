import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { WidgetsService } from './widgets.service';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';
import { SquacApiService } from '@core/services/squacapi.service';

describe('WidgetsService', () => {
  const testData = {
    id: 1,
    name: 'test',
    widgettype : {
      id: 1,
      type: 'type'
    },
    dashboard: {
      id: 1
    },
    metrics: [],
    thresholds: []
  };

  let squacApiService;
  let widgetsService: WidgetsService;
  const mockSquacApiService = new MockSquacApiService( testData );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: SquacApiService, useValue: mockSquacApiService
      }]
    });

    widgetsService = TestBed.inject(WidgetsService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {
    const service: WidgetsService = TestBed.inject(WidgetsService);
    expect(service).toBeTruthy();
  });

  it('should get widgets with dashboard id', (done: DoneFn) => {
    widgetsService.getWidgetsByDashboardId(1).subscribe(widgets => {
      expect(widgets.length).toEqual(1);
      done();
    });
  });

  it('should get widget with id', (done: DoneFn) => {
    widgetsService.getWidget(1).subscribe(widget => {
      expect(widget.id).toEqual(testData.id);
      done();
    });
  });
});


