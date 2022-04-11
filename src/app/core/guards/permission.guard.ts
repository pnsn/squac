import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { UserService } from "@features/user/services/user.service";
import { Ability } from "@casl/ability";
import { map, catchError, switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PermissionGuard implements CanActivate {
  constructor(private userService: UserService, private ability: Ability) {}
  // Returns true if there is a user and allows user to navigate
  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    return of(true);
    // FIXME: temporarily disabled
    // if (next.data && next.data.action && next.data.subject) {
    //   const subject = next.data.subject;
    //   const action = next.data.action;
    //   return this.userService.user.pipe(
    //     switchMap(
    //       user => {
    //         console.log(subject, action, this.ability.can(action, subject));
    //         return of(this.ability.can(action, subject));
    //       }
    //     ),
    //     catchError((err) => {
    //       return of(false);
    //     })
    //   );
    // } else {
    //   return of(true);
    // }
  }
}
