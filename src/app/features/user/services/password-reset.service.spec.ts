import { TestBed } from '@angular/core/testing';

import { PasswordResetService } from './password-reset.service';
import { SquacApiService } from '@core/services/squacapi.service';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';

describe('PasswordResetService', () => {
  let service: PasswordResetService;
  let squacApiService: SquacApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: SquacApiService, useValue:  new MockSquacApiService()}
      ]
    });
    service = TestBed.inject(PasswordResetService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should tell squac to reset password', () => {
    const postSpy = spyOn(squacApiService, 'post').and.callThrough();
    service.resetPassword('email').subscribe();
    expect(postSpy).toHaveBeenCalled();
  });

  it('should  send squac the token', () => {
    const postSpy = spyOn(squacApiService, 'post').and.callThrough();
    service.validateToken('token').subscribe();
    expect(postSpy).toHaveBeenCalled();
  });

  it('should send squac the password ', () => {
    const postSpy = spyOn(squacApiService, 'post').and.callThrough();
    service.confirmPassword('password').subscribe();
    expect(postSpy).toHaveBeenCalled();
  });
});
