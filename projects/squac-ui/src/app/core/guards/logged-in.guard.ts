import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

/**
 * Guard to prevent access to pages when user is logged in
 */
@Injectable({
  providedIn: "root",
})
export class LoggedInGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * @returns true if the user is not logged in
   */
  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(["/"]);
    }

    return !this.authService.isAuthenticated();
  }
}
