import { TestBed } from '@angular/core/testing';

import { InviteService } from './invite.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SquacApiService } from '@core/services/squacapi.service';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';

describe('InviteService', () => {
  let service: InviteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: SquacApiService , useValue:  new MockSquacApiService()}
      ]
    });
    service = TestBed.inject(InviteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
