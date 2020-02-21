import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';

interface UserHttpData {
  name: string;
  email: string;
  password: string;
} 
// Service to get user info & reset things
@Injectable({
  providedIn: 'root'
})
export class UserService {
  userInfo = new BehaviorSubject<{name:string, email:string}>(null);
  password : string;

  constructor(
    private http: HttpClient,
  ) { }

  getUser() {
    this.http.get<UserHttpData>('https://squacapi.pnsn.org/user/me/').subscribe(
      user => {
        console.log(user);
        this.userInfo.next({
          name: user.name, 
          email: user.email
        });
        this.password = user.password;
      }
    )
  }

  updateUser(name : string, email: string, password? : string) {
    return this.http.put<UserHttpData>('https://squacapi.pnsn.org/user/me/',
      {
        name : name,
        email : email,
        password : password ? password : this.password
      }
    )
  }
}
