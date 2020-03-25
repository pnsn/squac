import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(
    private userService: UserService) {
  }
  // Returns true if there is a user and allows user to navigate
  canActivate(): boolean | UrlTree {
    const user = this.userService.getUser();

    console.log(user)
    //return tru e if suer has permission
    return true;

    // return false if user does not

  }
  
}
