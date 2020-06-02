import { TestBed } from '@angular/core/testing';

import { PermissionGuard } from './permission.guard';
import { UserService } from './user.service';
import { MockUserService } from './user.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { AbilityModule } from '@casl/angular';
import { Ability, AbilityBuilder, PureAbility } from '@casl/ability';
import { AppAbility } from './ability';
import { Subscription, ReplaySubject } from 'rxjs';

class TestUserService  {
  testUser;
  user = new ReplaySubject();
  setUser(user) {
    this.testUser = user;
    this.user.next(this.testUser);
  }
  getUser() {
    return this.testUser;
  }
}
describe('PermissionGuard', () => {
  let guard: PermissionGuard;
  let ability: Ability;
  let userService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AbilityModule],
      providers: [
        {provide: UserService, useValue: new TestUserService()},
        { provide: AppAbility, useValue: new Ability() },
        { provide: PureAbility , useExisting: Ability }
      ]
    });
    guard = TestBed.inject(PermissionGuard);
    ability = TestBed.inject(Ability);
    userService = TestBed.inject(UserService);
    ability.update([{subject: 'Post', action: 'update'}]);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if there is no subject or action', () => {
    const route: any = { snapshot: {}, data: {}};

    expect(guard.canActivate(route)).toEqual(true);


  });

  it('should not allow user to route to resource without permission', (done) => {
    userService.setUser({
      name: 'User'
    });
    const route: any = { snapshot: {},
      data: {
        subject : 'Post',
        action: 'read'
      }
    };
    expect(ability.can('read', 'Post')).toEqual(false);
    expect(guard.canActivate(route)).toEqual(false);
    done();
  });

  it('should allow user to route to resource with permission', () => {
    userService.setUser({
      name: 'User'
    });
    const route: any = { snapshot: {},
      data: {
        subject : 'Post',
        action: 'update'
      }
    };
    expect(ability.can('update', 'Post')).toEqual(true);

    expect(guard.canActivate(route)).toEqual(true);
  });

});
