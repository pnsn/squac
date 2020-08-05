import { TestBed } from '@angular/core/testing';

import { InviteService } from './invite.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockSquacApiService } from './squacapi.service.mock';
import { SquacApiService } from './squacapi.service';

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
