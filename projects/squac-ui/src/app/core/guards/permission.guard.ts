import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { Ability } from "@casl/ability";

@Injectable({
  providedIn: "root",
})
export class PermissionGuard implements CanActivate {
  constructor(private ability: Ability) {}
  // Returns true if there is a user and allows user to navigate
  canActivate(_next: ActivatedRouteSnapshot): Observable<boolean> {
    return of(true);
    // FIXME: temporarily disabled
    // if (next.data && next.data.action && next.data.subject) {
    //   const subject = next.data.subject;
    //   const action = next.data.action;
    //   return this.userService.user.pipe(
    //     switchMap(
    //       user => {
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
