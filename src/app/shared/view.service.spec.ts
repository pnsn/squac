import { TestBed } from '@angular/core/testing';

import { ViewService } from './view.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockSquacApiService } from '../squacapi.service.mock';

describe('ViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  let squacApiService;

  let apiSpy;
  // const mockSquacApiService = new MockSquacApiService( testMetric );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: []
    });


  });
  it('should be created', () => {
    const service: ViewService = TestBed.get(ViewService);
    expect(service).toBeTruthy();
  });
});
