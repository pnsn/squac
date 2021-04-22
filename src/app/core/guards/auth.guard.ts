import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

// Ensures user is logged in before allowing access to protected routes
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Returns true if there is a user and allows user to navigate
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log("auth guard")
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string) : true | UrlTree {
    if (this.authService.loggedIn) {
      return true;
    }

    this.authService.redirectUrl = url;
    return this.router.parseUrl('/login');
  }

}
