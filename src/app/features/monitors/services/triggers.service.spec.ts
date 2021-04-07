import { TestBed } from '@angular/core/testing';
import { SquacApiService } from '@core/services/squacapi.service';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';

import { TriggersService } from './triggers.service';

describe('TriggersService', () => {
  let service: TriggersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ {provide: SquacApiService, useValue: new MockSquacApiService()}]
    });
    service = TestBed.inject(TriggersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
