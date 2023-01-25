import { Injectable } from "@angular/core";
import { AppAbility, defineAbilitiesFor } from "@core/utils/ability";

import { BehaviorSubject, Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { User } from "squacapi";
import { UserMeService } from "squacapi";

/**
 * Service for managing user info
 */
@Injectable({
  providedIn: "root",
})
export class UserService {
  private currentUser: User;
  user = new BehaviorSubject<User>(null);
  constructor(
    protected userMeService: UserMeService,
    private ability: AppAbility
  ) {}

  /**
   * Get organization id for current user
   *
   * @returns orgId
   */
  get userOrg(): number {
    return this.currentUser.orgId;
  }

  /**
   * Gets User info
   *
   * @returns Observable of loggedin user
   */
  getUser(): Observable<User> {
    if (this.currentUser) {
      return of(this.currentUser);
    }

    return this.userMeService.read().pipe(
      tap((user) => {
        console.log(user);
        this.currentUser = user;
        this.ability.update(defineAbilitiesFor(this.currentUser));
        console.log("here");
        this.user.next(this.currentUser);
      })
    );
  }

  /**
   * Get user & subscribe
   */
  fetchUser(): void {
    this.getUser().subscribe();
  }

  /**
   * Log current user out
   */
  logout(): void {
    this.currentUser = null;
    this.user.next(this.currentUser);
    this.ability.update([]);
  }

  /**
   * Update user information
   *
   * @param user changed user information
   * @returns Observable of user information
   */
  update(user: Partial<User>): Observable<User> {
    user.organization = this.userOrg;
    // other user ifo
    return this.userMeService.partialUpdate(user);
    // TODO: after it puts, update current user
  }
}
