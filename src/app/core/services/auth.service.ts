import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  ApiService,
  UserTokenCreateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { UserService } from "@user/services/user.service";
import { tap } from "rxjs/operators";
import {
  LocalStorageService,
  LocalStorageTypes,
} from "./local-storage.service";

const DEFAULT_MAX_LOGIN = 6; //hours

// Handles log in logic and API requests for login
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private token: string; // stores the token

  redirectUrl: string;
  constructor(
    private router: Router,
    protected api: ApiService,
    private userService: UserService
  ) {}

  // True if a user logged in
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // returns auth token
  get auth(): string {
    return this.token;
  }

  // Checks if user data exists in browser
  autologin() {
    const authData: {
      token: string;
      tokenExpirationDate: string;
    } = LocalStorageService.getItem(LocalStorageTypes.LOCAL, "userData");
    console.log(authData);
    // Don't log in if no auth data or is expired
    if (!authData || new Date() > new Date(authData.tokenExpirationDate)) {
      return;
    } else {
      this.handleAuth(authData.token);
    }
  }

  // after user enters data, log them in
  login(email: string, password: string) {
    const params: UserTokenCreateRequestParams = {
      data: {
        email,
        password,
      },
    };
    return this.api.userTokenCreate(params).pipe(
      tap((resData) => {
        this.handleAuth(resData.token);

        if (this.redirectUrl) {
          this.router.navigate([this.redirectUrl]);
          this.redirectUrl = null;
        } else {
          this.router.navigate(["/"]);
        }
      })
    );
  }

  // after user hits log out, wipe data
  logout() {
    this.userService.logout();
    this.token = null;
    this.router.navigate(["/login"]);

    LocalStorageService.invalidateCache();
  }

  // after login, save user data
  private handleAuth(token: string) {
    const msToExpire = DEFAULT_MAX_LOGIN * 60 * 60 * 1000;
    const expirationDate = new Date(new Date().getTime() + msToExpire);
    const authData = {
      token,
      tokenExpirationDate: expirationDate,
    };
    LocalStorageService.setItem(LocalStorageTypes.LOCAL, "userData", authData);
    this.token = authData.token;
  }
}
