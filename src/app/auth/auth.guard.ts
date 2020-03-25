import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
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
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.auth.pipe(
      take(1),
      map( auth => {
        console.log("this is the auth");
        return !!auth ? true : this.router.createUrlTree(['/login']);
      })
    );
  }

}
