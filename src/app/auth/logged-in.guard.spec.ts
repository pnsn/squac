import { TestBed } from '@angular/core/testing';

import { LoggedInGuard } from './logged-in.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { MockAuthService } from './auth.service.mock';
import { AuthService } from './auth.service';

describe('LoggedInGuard', () => {
  let guard: LoggedInGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [{provide: AuthService, useClass: MockAuthService}]
    });
    guard = TestBed.inject(LoggedInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should not allow user to access log in page after logged in', () => {
    //
  });

  it('should allow user to access log in after logging out', () => {
    
  });
});
