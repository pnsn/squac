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
import { Widget } from '../models/widget';
import { Metric } from '@core/models/metric';
import { ChannelGroup } from '@core/models/channel-group';

describe('WidgetEditService', () => {

  let squacApiService;
  let service: WidgetEditService;
  const mockSquacApiService = new MockSquacApiService(  );
  let widgetsService: WidgetsService;
  const testMetric = new Metric(
    1,
    1,
    'name',
    'code',
    'desc',
    '',
    ''
  );
  const testWidget = new Widget(
    1,
    1,
    'name',
    'desc',
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    [testMetric]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: SquacApiService, useValue: mockSquacApiService},
        { provide: ViewService, useValue: new MockViewService()},
        { provide: WidgetsService, useValue: new MockWidgetsService()},
        { provide: ThresholdsService, useValue: new MockThresholdsService() }
      ]
    });

    widgetsService = TestBed.inject(WidgetsService);
    service = TestBed.inject(WidgetEditService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set given widget', () => {
    expect(service.getWidget()).toBeFalsy();

    service.setWidget(testWidget, 1);

    expect(service.getWidget()).toBeTruthy();
    expect(service.getWidget()).toEqual(testWidget);
  });

  it('should be valid if widget has all properties', (done: DoneFn) => {
    service.setWidget(testWidget, 1);

    service.isValid.subscribe(
      isValid => {
        expect(isValid).toBeTruthy();
        done();
      }
    );

    service.updateMetrics([testMetric]);

  });

  it('should update thresholds', () => {
    service.setWidget(testWidget, 1);
    const testThreshold = {
      id : 1,
      metric: {id: 1},
      min: 0,
      max: 2,
      defaultMin: null,
      defaultMax: null
    } ;

    expect(service.getThresholds()).toBeDefined();

    service.updateThresholds([testThreshold]);

    expect(service.getThresholds()[1]).toBeDefined();
    expect(service.getThresholds()[1].id).toEqual(1);
  });

  it('should return channel group', () => {
    expect(service.getChannelGroup()).toBeUndefined();
    service.setWidget(testWidget, 1);

    const testChannelGroup = new ChannelGroup(1, 1, '', '', 1, false, false, []);

    service.updateChannelGroup(testChannelGroup);

    expect(service.getChannelGroup()).toEqual(testChannelGroup);

  });

  it('should return the metric Ids', () => {
    service.setWidget(testWidget, 1);

    expect(service.getMetricIds()).toEqual([testMetric.id]);

  });

  it('should update the saved type', () => {
    service.setWidget(testWidget, 1);
    const testTypeId = 2;
    service.updateType(testTypeId);

    expect(service.getWidget().typeId).toEqual(testTypeId);
  });

  it('should save the widget info', () => {
    service.setWidget(testWidget, 1);

    const newName = 'new name';
    service.updateWidgetInfo(
      newName,
      'desc',
      1
    );

    expect(service.getWidget().name).toBe(newName);
  });

  it('should clear the saved widget information', () => {
    service.setWidget(testWidget, 1);

    service.clearWidget();

    expect(service.getWidget()).toBeNull();
  });
});
