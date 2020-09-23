import { TestBed } from '@angular/core/testing';

import { WidgetEditService } from './widget-edit.service';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SquacApiService } from '@core/services/squacapi.service';
import { ViewService } from '@core/services/view.service';
import { MockViewService } from '@core/services/view.service.mock';
import { MockWidgetsService } from './widgets.service.mock';
import { WidgetsService } from './widgets.service';
import { ThresholdsService } from './thresholds.service';
import { MockThresholdsService } from './thresholds.service.mock';

describe('WidgetEditService', () => {

  let squacApiService;
  let widgetEditService: WidgetEditService;
  const mockSquacApiService = new MockSquacApiService(  );
  let widgetsService: WidgetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: SquacApiService, useValue: mockSquacApiService},
        { provide: ViewService, useClass: MockViewService},
        { provide: WidgetsService, useClass: MockWidgetsService},
        { provide: ThresholdsService, useClass: MockThresholdsService }
      ]
    });

    widgetsService = TestBed.inject(WidgetsService);
    widgetEditService = TestBed.inject(WidgetEditService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {
    expect(widgetEditService).toBeTruthy();
  });

  it('should be valid if widget has all properties', () => {

  });

  it('should return thresholds', () => {

  });

  it('should set initial widget values', () => {

  });

  it('should return channel group', () => {

  });

  it('should return the metric Ids', () => {

  });

  it('should save the channel group', () => {

  });

  it('should save the metrics', () => {

  });

  it('should update the saved type', () => {

  });

  it('should save the selected thresholds', () => {

  });

  it('should save the widget info', () => {

  });

  it('should clear the saved widget information', () => {

  });

  it('should save the widget to the widget service', () => {

  });
});
