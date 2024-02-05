import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { User } from "squacapi";
import { UserService } from "../../../features/user/services/user.service";

/**
 * Resolver for currently logged in user
 */
@Injectable({
  providedIn: "root",
})
export class UserResolver implements Resolve<Observable<User>> {
  constructor(private userService: UserService) {}

  /**
   * Resolve the current user
   *
   * @returns Observable of current user
   */
  resolve(): Observable<User> {
    return this.userService.getUser();
  }
}
