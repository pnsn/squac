import { TestBed } from '@angular/core/testing';

import { PermissionGuard } from './permission.guard';
import { UserService } from './user.service';
import { MockUserService } from './user.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { AbilityModule } from '@casl/angular';
import { Ability } from '@casl/ability';

describe('PermissionGuard', () => {
  let guard: PermissionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), AbilityModule],
      providers: [
        {provide: UserService, useClass: MockUserService},
        {provide: Ability, useValue: new Ability()}
      ]
    });
    guard = TestBed.inject(PermissionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should not allow user to route to resource without permission', () => {
    //
  });

  it('should allow user to route to resource with permission', () => {
    
  });
  
});
