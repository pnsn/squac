import { BehaviorSubject } from 'rxjs';
import { User } from './user';

export class MockAuthService {
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
    this.user.next( new User(userEmail, "token", new Date()));
  }

  logout() {
    this.user.next(null);
  }

}