import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Metric } from '@core/models/metric';
import { Channel } from '@core/models/channel';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';
import { SquacApiService } from '@core/services/squacapi.service';
import { MeasurementsService } from './measurements.service';
import { ViewService } from '@core/services/view.service';
import { MockViewService } from '@core/services/view.service.mock';

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
      providers: [
        MeasurementsService,
        { provide: SquacApiService, useValue: mockSquacApiService },
        { provide: ViewService, useClass: MockViewService}
     ]
    });

    measurementsService = TestBed.inject(MeasurementsService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {
    expect(measurementsService).toBeTruthy();
  });

  it('should set widget', () => {

  });

  it('should get measurements for widget',() => {

  });

  it('should not try to fetch measurements if no widget', ()=>{
    
  });

  // it('should get measurements', (done: DoneFn) => {
  //   const testWidget = new Widget(1, 1, '', '', 1, 1, 1, 1, 1, 1, 1, [
  //     testMetric
  //   ]);

  //   testWidget.channelGroup = new ChannelGroup(
  //     1, 1, '', '', true, [
  //       testChannel
  //     ]
  //   );

  //   measurementsService.data.subscribe(
  //     response => {
  //       expect(response[1][1].id).toEqual(1);
  //       done();
  //     }
  //   );

  //   measurementsService.fetchMeasurements(
  //     new Date(),
  //     new Date()
  //   );
  // });

});
