import { TestBed } from '@angular/core/testing';

import { ThresholdsService } from './thresholds.service';
import { MockSquacApiService } from '../squacapi.service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SquacApiService } from '../squacapi.service';

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

    thresholdsService = TestBed.get(ThresholdsService);
    squacApiService = TestBed.get(SquacApiService);
  });

  it('should be created', () => {
    const service: ThresholdsService = TestBed.get(ThresholdsService);
    expect(service).toBeTruthy();
  });
});
