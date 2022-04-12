import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})

// Ensures user is logged in before allowing access to protected routes
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // Returns true if there is a user and allows user to navigate
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.authService.loggedIn) {
      return true;
    }
    this.authService.redirectUrl = url;
    this.router.navigate(["../login"]);
    return false;
  }
}
