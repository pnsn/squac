import { Injectable } from "@angular/core";
import { AppAbility, defineAbilitiesFor } from "@core/utils/ability";
import {
  ApiService,
  ReadOnlyUserMeSerializer,
  UserMePartialUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { User } from "../models/user";

interface UserHttpData {
  email?: string;
  password?: string;
  firstname: string;
  lastname: string;
  organization?: string;
}

// Service to get user info & reset things
@Injectable({
  providedIn: "root",
})
export class UserService {
  private url = "user/me/";
  private currentUser: User;
  user = new BehaviorSubject<User>(null);
  constructor(private api: ApiService, private ability: AppAbility) {}

  // returns orgId for current user
  get userOrg(): number {
    return this.currentUser.orgId;
  }

  // gets current logged in user
  getUser(): Observable<User> {
    if (this.currentUser) {
      return of(this.currentUser);
    }
    return this.api.userMeRead().pipe(
      map((response: ReadOnlyUserMeSerializer) => {
        const currentUser = new User(
          response.id,
          response.email,
          response.firstname,
          response.lastname,
          response.organization,
          response.is_org_admin,
          response.groups
        );
        currentUser.squacAdmin = response.is_staff;
        return currentUser;
      }),
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
  updateUser(user): Observable<any> {
    const putData: UserMePartialUpdateRequestParams = {
      data: {
        organization: this.userOrg,
        firstname: user.firstName,
        lastname: user.lastName,
      },
    };

    // other user ifo
    return this.api.userMePartialUpdate(putData);
    // TODO: after it puts, update current user
  }
}
