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
    private ability : Ability,
    private router : Router
    ) {
  }
  // Returns true if there is a user and allows user to navigate
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const user = this.userService.getUser(); // will need this for ownership
    const subject = next.data.subject;
    const action = next.data.action;


    if(subject && action) {
      console.log(subject, action, this.ability.can(action, subject));
      return this.ability.can(action, subject);
    } else {
      return true;
    }
  }
  
}
