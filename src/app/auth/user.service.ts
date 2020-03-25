import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';
import { SquacApiService } from '../squacapi.service';
import { Ability } from '@casl/ability';
import { defineAbilitiesFor } from 'src/app/ability';

// Service to get user info & reset things
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = '/user/me';
  user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private squacApi: SquacApiService,
    private ability: Ability
  ) { }

  getUser() {
    this.squacApi.get(this.url).subscribe(
      response => {
        console.log(response);
        const user = new User(
          response.email,
          response.password,
          response.firstname,
          response.lastname,
          response.is_staff,
          response.organization,
          response.groups
        );
        
        this.ability.update(defineAbilitiesFor(user));
        this.user.next(user);
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
    // other user ifo
    return this.squacApi.put(this.url, null, user);
  }
}
