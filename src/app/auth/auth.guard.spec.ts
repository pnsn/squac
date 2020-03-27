import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { MockAuthService } from './auth.service.mock';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        RouterTestingModule.withRoutes([
        ]
      )],
      providers: [
        { provide: AuthService, useClass: MockAuthService}
      ]
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should not allow routing if not authorized', () => {

    expect(authService.loggedIn).toBeFalsy();
    expect(guard.canActivate()).toBeTruthy();

  });

  it('should allow routing after authorization', () => {
    authService.login('email', 'password');
    expect(guard.canActivate()).toEqual(true);
  });

});
