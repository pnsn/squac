
import { BehaviorSubject, of } from 'rxjs';
import { User } from './user';

// Service to get user info & reset things

export class MockUserService {
  constructor() {}
  private currentUser = new User(
    "email",
    "firstname",
    "lastname",
    true,
    "organization",
    ["contributor"]
  );
  user = new BehaviorSubject<User>(null);

  getUser() : User {
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
