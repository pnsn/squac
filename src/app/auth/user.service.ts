import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';

interface UserHttpData {
  email : string,
  password: string, 
  firstname: string,
  lastname: string, 
  is_staff : boolean,
  organization: string,
  groups: string[]
} 
// Service to get user info & reset things
@Injectable({
  providedIn: 'root'
})
export class UserService {
  user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
  ) { }

  getUser() {
    this.http.get<UserHttpData>('https://squacapi.pnsn.org/user/me/').subscribe(
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
      }
    )
  }

  //User needs to enter password to make changes
  updateUser(user) {
    //other user ifo
    return this.http.put<UserHttpData>('https://squacapi.pnsn.org/user/me/',
      {
        user
      }
    )
  }
}
