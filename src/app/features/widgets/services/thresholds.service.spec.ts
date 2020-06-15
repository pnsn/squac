import { TestBed } from '@angular/core/testing';

import { ThresholdsService } from './thresholds.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';
import { SquacApiService } from '@core/services/squacapi.service';

describe('ThresholdsService', () => {
  const testData = {
    id: 1,
    metric: 1,
    widget: 1,
    minval: 1,
    maxval: 1
  };

  let squacApiService;
  let thresholdsService: ThresholdsService;
  const mockSquacApiService = new MockSquacApiService( testData );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
});
