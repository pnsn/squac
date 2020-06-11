import { TestBed } from '@angular/core/testing';

import { StatTypeService } from './stattype.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SquacApiService } from './squacapi.service';
import { MockSquacApiService } from './squacapi.service.mock';

describe('StatTypeService', () => {
  let statTypeService: StatTypeService;
  let squacApiService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: SquacApiService, useValue: new MockSquacApiService()
      }]
    });

    statTypeService = TestBed.inject(StatTypeService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {
    expect(statTypeService).toBeTruthy();
  });
});
