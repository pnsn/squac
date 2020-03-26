import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // returns prevents user from accessing certain pages when logged in
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.loggedIn ? this.router.createUrlTree(['/']) : true;
  }

}
