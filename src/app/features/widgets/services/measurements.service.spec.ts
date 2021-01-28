import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Metric } from '@core/models/metric';
import { Channel } from '@core/models/channel';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';
import { SquacApiService } from '@core/services/squacapi.service';
import { MeasurementsService } from './measurements.service';
import { ViewService } from '@core/services/view.service';
import { MockViewService } from '@core/services/view.service.mock';
import { Widget } from '../models/widget';
import { ChannelGroup } from '@core/models/channel-group';

describe('MeasurementsService', () => {
  const testData = {
    id: 1,
    metric: 1,
    channel: 1,
    value: 1,
    starttime: 'start',
    endtime: 'end'
  };
  const testMetric = new Metric(1, 1, '', '', '', '', '', 1);
  const testChannel = new Channel(1, '', '', 1, 1, 1, 1, '', '', '');
  const testWidget = new Widget(1, 1, '', '', 1, 1, 1, 1, 1, 1, 1, [
    testMetric
  ]);
  testWidget.channelGroup = new ChannelGroup(1, 1, '', '', 1, false, false, [ 1, 2]);
  testWidget.channelGroup.channels = [testChannel];

  let squacApiService;
  let measurementsService: MeasurementsService;
  const mockSquacApiService = new MockSquacApiService( testData );
  let viewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MeasurementsService,
        { provide: SquacApiService, useValue: mockSquacApiService },
        { provide: ViewService, useValue: new MockViewService()}
     ]
    });

    measurementsService = TestBed.inject(MeasurementsService);
    viewService = TestBed.inject(ViewService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {
    expect(measurementsService).toBeTruthy();
  });

  it('should set widget', () => {
    const widgetSpy = spyOn(measurementsService, 'setWidget');

    measurementsService.setWidget(testWidget);

    expect(widgetSpy).toHaveBeenCalled();
  });

  it('should not try to fetch measurements if no widget', () => {
    const viewSpy = spyOn(viewService, 'widgetStartedLoading');
    measurementsService.fetchMeasurements('start', 'end');
    expect(viewSpy).not.toHaveBeenCalled();
  });

  it('should try to get measurements if there is a widget and dates', () => {

    measurementsService.setWidget(testWidget);

    const viewSpy = spyOn(viewService, 'widgetStartedLoading');
    measurementsService.fetchMeasurements('start', 'end');
    expect(viewSpy).toHaveBeenCalled();
  });

});
