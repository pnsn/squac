import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SquacApiService } from '.././squacapi.service';
import { MockSquacApiService } from '.././squacapi.service.mock';
import { MeasurementsService } from './measurements.service';
import { Measurement } from './measurement';

describe('MeasurementsService', () => {
  const testData = {
    id: 1,
    metric: 1,
    channel: 1,
    value: 1,
    starttime: 'start',
    endtime: 'end'
  };

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

    measurementsService = TestBed.get(MeasurementsService);
    squacApiService = TestBed.get(SquacApiService);
  });

  it('should be created', () => {
    const service: MeasurementsService = TestBed.get(MeasurementsService);
    expect(service).toBeTruthy();
  });

  it('should get measurements', (done: DoneFn) => {
    measurementsService.getMeasurements('1', '1', 'date', 'date').subscribe(measurements => {
      expect(measurements[1][1][0].id).toEqual(1);
      done();
    });
  });

});
