import { TestBed } from '@angular/core/testing';

import { ThresholdsService } from './thresholds.service';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';
import { SquacApiService } from '@core/services/squacapi.service';
import { Metric } from '@core/models/metric';

describe('ThresholdsService', () => {
  const testData = {
    id: 1,
    metric: 1,
    widget: 1,
    minval: 1,
    maxval: 1
  };

  const testMetrics = [
    new Metric(1, 1, 'name', 'code', 'desc', 'ref', 'unit', 1)
  ];
  const testThresholds = {
    1 : {
      min: 1,
      max: 2,
      id: 1
    }
  };

  let squacApiService;
  let thresholdsService: ThresholdsService;
  const mockSquacApiService = new MockSquacApiService( testData );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [{
        provide: SquacApiService, useValue: mockSquacApiService
      }]
    });

    thresholdsService = TestBed.inject(ThresholdsService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {
    const service: ThresholdsService = TestBed.inject(ThresholdsService);
    expect(service).toBeTruthy();
  });

  it('should delete threshold', () => {
   const deleteSpy = spyOn(squacApiService, 'delete').and.callThrough();

   const reqs = thresholdsService.updateThresholds(testMetrics, {1 : {id: 1, min: null, max: null}}, 1);

   reqs[0].subscribe();

   expect (deleteSpy).toHaveBeenCalled();
  });

  it('should return no requests if no metric', () => {
     const reqs = thresholdsService.updateThresholds([], {1 : {id: 1, min: null, max: null}}, 1);
     expect (reqs.length).toEqual(0);
   });

  it('should ignore metrics with no thresholds', () => {
    const reqs = thresholdsService.updateThresholds(testMetrics, {2 : {id: 1, min: null, max: null}}, 1);
    expect (reqs.length).toEqual(0);
  });

  it('should save new threshold', () => {
    const postSpy = spyOn(squacApiService, 'post').and.callThrough();

    const reqs = thresholdsService.updateThresholds(testMetrics, {1 : {min: 1}}, 1);
    reqs[0].subscribe();
    expect (postSpy).toHaveBeenCalled();
  });

  it('should update existing threshold', () => {
    const putSpy = spyOn(squacApiService, 'put').and.callThrough();

    const reqs = thresholdsService.updateThresholds(testMetrics, {1 : {id: 1, min: 1}}, 1);
    reqs[0].subscribe();
    expect (putSpy).toHaveBeenCalled();
  });

});
