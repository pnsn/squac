import { TestBed } from '@angular/core/testing';

import { PermissionGuard } from './permission.guard';
import { UserService } from './user.service';
import { MockUserService } from './user.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { AbilityModule } from '@casl/angular';
import { Ability, AbilityBuilder } from '@casl/ability';

describe('PermissionGuard', () => {
  let guard: PermissionGuard;

  let testAbility = AbilityBuilder.define( can =>{
    can("update", "Post");
  });

  let ability : Ability;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), AbilityModule],
      providers: [
        {provide: UserService, useClass: MockUserService},
        {provide: Ability, useValue: testAbility}
      ]
    });
    guard = TestBed.inject(PermissionGuard);
    ability = TestBed.inject(Ability);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if there is no subject or action', ()=> {
    let route: any = { snapshot: {}, data: {}};
    
    expect(guard.canActivate(route)).toEqual(true);


  })

  it('should not allow user to route to resource without permission', () => {
    let route: any = { snapshot: {}, 
      data: {
        subject : "Post",
        action: "read"
      }
    };
    expect(ability.can("read", "Post")).toEqual(false);

    expect(guard.canActivate(route)).toEqual(false);
  });

  it('should allow user to route to resource with permission', () => {
    let route: any = { snapshot: {}, 
      data: {
        subject : "Post",
        action: "update"
      }
    };
    expect(ability.can("update", "Post")).toEqual(true);

    expect(guard.canActivate(route)).toEqual(true);
  });
  
});
