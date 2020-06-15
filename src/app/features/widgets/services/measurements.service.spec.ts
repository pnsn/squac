import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MeasurementsService } from './measurements.service';
import { Widget } from '../../../core/models/widget';
import { Metric } from '@core/models/metric';
import { Channel } from '@core/models/channel';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';
import { SquacApiService } from '@core/services/squacapi.service';
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
  const testMetric = new Metric(1, 1, '', '', '', '', '');
  const testChannel = new Channel(1, '', '', 1, 1, 1, 1, '', '', '');

  let squacApiService;
  let measurementsService: MeasurementsService;
  const mockSquacApiService = new MockSquacApiService( testData );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: SquacApiService, useValue: mockSquacApiService
      }]
    });

    measurementsService = TestBed.inject(MeasurementsService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {
    const service: MeasurementsService = TestBed.inject(MeasurementsService);
    expect(service).toBeTruthy();
  });

  it('should get measurements', (done: DoneFn) => {
    const testWidget = new Widget(1, 1, '', '', 1, 1, 1, 1, 1, 1, 1, [
      testMetric
    ]);

    testWidget.channelGroup = new ChannelGroup(
      1, 1, '', '', true, [
        testChannel
      ]
    );

    measurementsService.getMeasurements(
      testWidget,
      new Date(),
      new Date()
    ).subscribe(measurements => {
      expect(measurements[1][1][0].id).toEqual(1);
      done();
    });
  });

});
