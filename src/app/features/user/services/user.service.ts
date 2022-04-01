import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user';
import { SquacApiService } from '@core/services/squacapi.service';
import { defineAbilitiesFor, AppAbility } from '@core/utils/ability';
import { map, tap } from 'rxjs/operators';

interface UserHttpData {
  email ?: string;
  password ?: string;
  firstname: string;
  lastname:	string;
  organization ?: string;
}

// Service to get user info & reset things
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'user/me/';
  private currentUser: User;
  user = new BehaviorSubject<User>(null);
  constructor(
    private squacApi: SquacApiService,
    private ability: AppAbility
  ) { }

  // returns orgId for current user
  get userOrg(): number {
    return this.currentUser.orgId;
  }

  // gets current logged in user
  getUser(): Observable<User> {
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

  // get user and subcsribe
  fetchUser(): void{
    this.getUser().subscribe();
  }

  // logs current user out
  logout(): void{
    this.currentUser = null;
    this.user.next(this.currentUser);
    this.ability.update([]);
  }

  // User needs to enter password to make changes
  updateUser(user): Observable<any>{
    const putData: UserHttpData = {
      firstname: user.firstName,
      lastname: user.lastName
    };

    // other user ifo
    return this.squacApi.patch(this.url, null, putData);
    // TODO: after it puts, update current user
  }

}
