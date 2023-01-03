import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { AuthService } from "../services/auth.service";

/**
 * Guard to prevent access to routes requiring authentication
 */
@Injectable({
  providedIn: "root",
})

// Ensures user is logged in before allowing access to protected routes
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // Returns true if there is a user and allows user to navigate
  /**
   * Returns true if a user is allowed to activate the given route
   *
   * @param _next activated route
   * @param state router state
   * @returns true if can activate
   */
  canActivate(
    _next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  /**
   * Checks user is logged in, redirects to login page
   * if user is not logged in
   *
   * @param url requested url
   * @returns true if user is logged in
   */
  checkLogin(url: string): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.authService.redirectUrl = url;
    this.router.navigate(["../login"]);
    return false;
  }
}
