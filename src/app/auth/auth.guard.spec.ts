import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { MockAuthService } from './auth.service.mock';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        RouterTestingModule.withRoutes([
        ]
      )],
      providers: [
        { provide: AuthService, useValue: new MockAuthService() }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should not allow routing if not authorized', () => {
    //
  });

  it('should allow routing after authorization', () => {
    
  });

});
