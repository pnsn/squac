import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { Ability } from '@casl/ability';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private ability: Ability,
    ) {
  }
  // Returns true if there is a user and allows user to navigate
  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> | boolean{
      console.log("navigate?")
    if (next.data && next.data.action && next.data.subject) {
      const subject = next.data.subject;
      const action = next.data.action;

      return this.userService.user.pipe(
        map(
          user => {
            console.log(user, subject, action, this.ability.can(action, subject));
            return this.ability.can(action, subject);
          }
        )
      )
    } else {
      return true;
    }
  }
}
