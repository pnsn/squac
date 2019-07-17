import { TestBed } from '@angular/core/testing';

import { MetricGroupsService } from './metric-groups.service';

describe('MetricGroupsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MetricGroupsService = TestBed.get(MetricGroupsService);
    expect(service).toBeTruthy();
  });
});
