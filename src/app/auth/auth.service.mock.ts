import { BehaviorSubject, of } from 'rxjs';
import { User } from './user';

export class MockAuthService {
  constructor() {}
  auth = new BehaviorSubject<User>(null);

  testAuth = '2352fsdf';

  autologin() {
    this.auth.next(this.testAuth);
  }

  autologout() {
    this.auth.next(null);
  }

  login(userEmail: string, userPassword: string) {
    this.auth.next(this.testAuth);
    return of({email: userEmail, token: this.testAuth});
  }

  logout() {
    this.auth.next(null);
  }

}
