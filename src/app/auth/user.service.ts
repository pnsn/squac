import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';
import { SquacApiService } from '../squacapi.service';
import { Ability } from '@casl/ability';
import { defineAbilitiesFor } from 'src/app/ability';

interface UserHttpData {
  email :string,
  password: string,
  firstname: string,
  lastname:	string,
  organization: string
}

// Service to get user info & reset things
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = '/user/me';
  private currentUser;
  user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private squacApi: SquacApiService,
    private ability: Ability
  ) { }

  getUser() : User {
    return this.currentUser;
  }

  fetchUser() {
    this.squacApi.get(this.url).subscribe(
      response => {

        this.currentUser = new User(
          response.email,
          response.firstname,
          response.lastname,
          response.is_staff,
          response.organization,
          response.groups
        );
        
        this.ability.update(defineAbilitiesFor(this.currentUser));
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
  updateUser(user, password) {
    const putData: UserHttpData = {
      email: user.email,
      password: password,
      firstname: user.firstname,
      lastname: user.lastname,
      organization: user.organization
    }
  
    // other user ifo
    return this.squacApi.put(this.url, null, putData);
    //TODO: after it puts, update current user
  }
}
