import { BehaviorSubject, of } from 'rxjs';
import { User } from './user';

export class MockAuthService {
  constructor(){}
  user = new BehaviorSubject<User>(null);

  testUser = new User(
    'email',
    'token',
    new Date()
  );

  autologin() {
    this.user.next(this.testUser);
  }

  autologout() {
    this.user.next(null);
  }

  login(userEmail: string, userPassword: string) {
    this.user.next(this.testUser);
    return of({email: userEmail, token: "token"});
  }

  logout() {
    this.user.next(null);
  }

}