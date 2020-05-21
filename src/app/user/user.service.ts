import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';
import { SquacApiService } from '../squacapi.service';
import { Ability, AbilityBuilder } from '@casl/ability';
import { defineAbilitiesFor, AppAbility } from './ability';

interface UserHttpData {
  email: string;
  password: string;
  firstname: string;
  lastname:	string;
  organization: string;
}

// Service to get user info & reset things
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'user/me/';
  private currentUser;
  user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private squacApi: SquacApiService,
    private ability: AppAbility
  ) { }

  getUser(): User {
    return this.currentUser;
  }

  fetchUser() {
    console.log("fetchUser");
    this.squacApi.get(this.url).subscribe(
      response => {
        const groups = [];
        for (const group of response.groups) {
          groups.push(group.name);
        }

        this.currentUser = new User(
          response.id,
          response.email,
          response.firstname,
          response.lastname,
          response.is_staff,
          response.organization,
          groups
        );
        console.log(this.ability.can('read', 'Dashboard'));
        this.ability.update(defineAbilitiesFor(this.currentUser));
        console.log(this.ability.can('read', 'Dashboard'));
        this.user.next(this.currentUser);
      },

      error => {
        console.log('error in user service: ' + error);
      }
    );
  }

  logout() {
    this.user.next(null);
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
