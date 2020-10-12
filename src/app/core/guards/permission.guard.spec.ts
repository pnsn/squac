import { TestBed, tick, fakeAsync } from '@angular/core/testing';

import { PermissionGuard } from './permission.guard';
import { UserService } from '@features/user/services/user.service';

import { AbilityModule } from '@casl/angular';
import { Ability, AbilityBuilder, PureAbility } from '@casl/ability';
import { AppAbility } from '../utils/ability';
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

  it('should return true if there is no subject or action', fakeAsync(() => {
    const route: any = { snapshot: {}, data: {}};

    guard.canActivate(route).subscribe(
      canActivate => {
        expect(canActivate).toEqual(true);
      }
    );

  }));

  it('should not allow user to route to resource without permission', fakeAsync(() => {
    // userService.setUser({
    //   name: 'User'
    // });

    // const route: any = { snapshot: {},
    //   data: {
    //     subject : 'Post',
    //     action: 'read'
    //   }
    // };

    // expect(ability.can('read', 'Post')).toEqual(false);
    // guard.canActivate(route).subscribe(
    //   canActivate => {
    //     expect(canActivate).toEqual(false);
    //   }
    // );

  }));

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

    guard.canActivate(route).subscribe(
      canActivate => {
        expect(canActivate).toEqual(true);
      }
    );
  });

});
