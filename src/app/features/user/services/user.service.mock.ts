
import { BehaviorSubject, of } from 'rxjs';
import { User } from '../models/user';

// Service to get user info & reset things

export class MockUserService {
  constructor() {}
  private currentUser = new User(
    1,
    'email',
    'firstName',
    'lastName',
    1,
    true,
    ['contributor']
  );
  user = new BehaviorSubject<User>(null);

  get userOrg(): number {
    return this.currentUser.orgId;
  }

  getUser(): User {
    return this.currentUser;
  }

  fetchUser() {
    this.user.next(this.currentUser);
  }

  logout() {
    this.user.next(null);
  }

  // User needs to enter password to make changes
  updateUser(user) {
    return of(user);
  }
}
