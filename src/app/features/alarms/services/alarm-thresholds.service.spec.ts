import { TestBed } from '@angular/core/testing';

import { AlarmThresholdsService } from './alarm-thresholds.service';

describe('AlarmThresholdsService', () => {
  let service: AlarmThresholdsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlarmThresholdsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
