import { TestBed } from '@angular/core/testing';

import { LoggedInGuard } from './logged-in.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { MockAuthService } from '../services/auth.service.mock';
import { AuthService } from '../services/auth.service';

describe('LoggedInGuard', () => {
  let guard: LoggedInGuard;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [{provide: AuthService, useClass: MockAuthService}]
    });
    guard = TestBed.inject(LoggedInGuard);
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should not allow user to access log in page after logged in', () => {
    authService.login('email', 'password');
    expect(guard.canActivate()).toBeTruthy();
  });

  it('should allow user to access log in after logging out', () => {
    authService.logout();
    expect(authService.loggedIn).toBeFalsy();
    expect(guard.canActivate()).toEqual(true);
  });
});
