import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';
import { SquacApiService } from '../squacapi.service';

// Service to get user info & reset things
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = '/user/me';
  user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private squacApi: SquacApiService
  ) { }

  getUser() {
    this.squacApi.get(this.url).subscribe(
      response => {
        console.log(response);
        this.user.next(new User(
          response.email,
          response.password,
          response.firstname,
          response.lastname,
          response.is_staff,
          response.organization,
          response.groups
        ));
      },
      error => {
        console.log('error in user service: ' + error);
      }
    );
  }

  // User needs to enter password to make changes
  updateUser(user) {
    // other user ifo
    return this.squacApi.put(this.url, null, user);
  }
}
