import { BehaviorSubject } from 'rxjs';
import { User } from './user';

export class MockAuthService {
  user = new BehaviorSubject<User>(null);

  logIn() {
    this.user.next(new User(
      'email',
      'token',
      new Date()
    ));
  }

  logOut() {
    this.user.next(null);
  }

}