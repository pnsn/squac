import { TestBed } from '@angular/core/testing';

import { ThresholdsService } from './thresholds.service';

describe('ThresholdsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThresholdsService = TestBed.get(ThresholdsService);
    expect(service).toBeTruthy();
  });
});
