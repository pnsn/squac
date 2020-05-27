import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { Ability } from '@casl/ability';

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
  canActivate(next: ActivatedRouteSnapshot): boolean | UrlTree {
    if (next.data) {
      const subject = next.data.subject;
      const action = next.data.action;

      this.userService.user.subscribe(
        user => {
          if (subject && action && user) {
            console.log(user, subject, action, this.ability.can(action, subject));
            return this.ability.can(action, subject);
          }
        },
        error => {
          console.log('redirect to logout');
        }
      );


    }

    return true;
  }
}
