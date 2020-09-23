import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, ReplaySubject, Subject, Observable, of } from 'rxjs';
import { User } from '../models/user';
import { SquacApiService } from '@core/services/squacapi.service';
import { Ability, AbilityBuilder } from '@casl/ability';
import { defineAbilitiesFor, AppAbility } from '@core/utils/ability';
import { flatMap, map, tap } from 'rxjs/operators';

interface UserHttpData {
  email: string;
  password: string;
  firstName: string;
  lastName:	string;
  organization: string;
}

// Service to get user info & reset things
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'user/me/';
  private currentUser: User;
    // FIXME: because it is a replay sometimes after logout a "user" still returns
  user = new BehaviorSubject<User>(null);
  constructor(
    private http: HttpClient,
    private squacApi: SquacApiService,
    private ability: AppAbility
  ) { }
  fetchUser() {
    this.getUser().subscribe();
  }
  get userOrg() {
    return this.currentUser.orgId;
  }
  getUser(): Observable<User> {
    console.log('getting User');
    if (this.currentUser) {
      return of(this.currentUser);
    }
    return this.squacApi.get(this.url).pipe(
      map(
        response => {
          const currentUser = new User(
            response.id,
            response.email,
            response.firstname,
            response.lastname,
            response.organization,
            response.is_org_admin,
            response.groups
          );
          currentUser.squacAdmin = response.is_staff;
          return currentUser;
        }
      ),
      tap(
        user => {
          this.currentUser = user;
          this.ability.update(defineAbilitiesFor(this.currentUser));
          this.user.next(this.currentUser);
        }
      )
    );
  }

  logout() {
    this.currentUser = null;
    this.user.next(this.currentUser);
    this.ability.update([]);
  }

  // User needs to enter password to make changes
  updateUser(user) {
    const putData: UserHttpData = user;

    // other user ifo
    return this.squacApi.patch(this.url, null, putData);
    // TODO: after it puts, update current user
  }


}
