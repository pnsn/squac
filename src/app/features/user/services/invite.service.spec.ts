import { TestBed } from '@angular/core/testing';

import { InviteService } from './invite.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SquacApiService } from '@core/services/squacapi.service';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';

describe('InviteService', () => {
  let service: InviteService;
  let squacApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: SquacApiService , useValue:  new MockSquacApiService()}
      ]
    });
    service = TestBed.inject(InviteService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send invite', () => {
    const postSpy = spyOn(squacApiService, 'post').and.callThrough();
    service.sendInviteToUser(1).subscribe();
    expect(postSpy).toHaveBeenCalled();
  });

  it('should send register info', () => {
    const postSpy = spyOn(squacApiService, 'post').and.callThrough();
    service.registerUser('name', 'lastname', 'token', 'password').subscribe();
    expect(postSpy).toHaveBeenCalled();
  });
});
