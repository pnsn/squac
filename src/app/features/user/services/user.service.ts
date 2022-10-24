import { Injectable } from "@angular/core";
import { AppAbility, defineAbilitiesFor } from "@core/utils/ability";
import {
  ApiService,
  ReadOnlyUserMeSerializer,
  UserMePartialUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { User } from "@squacapi/models/user";
import { UserMeService } from "@squacapi/services/user-me.service";

// Service to get user info & reset things
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

  // returns orgId for current user
  get userOrg(): number {
    return this.currentUser.orgId;
  }

  // gets current logged in user
  getUser(): Observable<User> {
    if (this.currentUser) {
      return of(this.currentUser);
    }

    return this.userMeService.read().pipe(
      tap((user) => {
        this.currentUser = user;
        this.ability.update(defineAbilitiesFor(this.currentUser));
        this.user.next(this.currentUser);
      })
    );
  }

  // get user and subcsribe
  fetchUser(): void {
    this.getUser().subscribe();
  }

  // logs current user out
  logout(): void {
    this.currentUser = null;
    this.user.next(this.currentUser);
    this.ability.update([]);
  }

  // User needs to enter password to make changes
  update(user: Partial<User>): Observable<any> {
    user.orgId = this.userOrg;
    // other user ifo
    return this.userMeService.update(user);
    // TODO: after it puts, update current user
  }
}
