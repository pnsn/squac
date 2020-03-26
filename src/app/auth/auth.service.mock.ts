import { BehaviorSubject, of } from 'rxjs';
import { User } from './user';

export class MockAuthService {
  constructor() {}
  token : string;

  testAuth = '2352fsdf';

  get loggedIn() : boolean {
    return !!this.token;
  }

  autologin() {
    this.token = this.testAuth;
  }

  autologout() {
    this.token = null;
  }

  login(userEmail: string, userPassword: string) {
    this.token = this.testAuth;
    return of({email: userEmail, token: this.testAuth});
  }

  logout() {
    this.token = null;
  }

}
