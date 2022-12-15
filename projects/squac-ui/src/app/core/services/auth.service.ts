import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  ApiService,
  UserTokenCreateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { UserService } from "@user/services/user.service";
import { Observable } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { User } from "squacapi";
import {
  LocalStorageService,
  LocalStorageTypes,
} from "./local-storage.service";

const DEFAULT_MAX_LOGIN = 6; //hours

/**
 * Handles logging in logic
 */
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private token: string; // stores the token

  redirectUrl: string;
  constructor(
    private router: Router,
    private api: ApiService,
    private userService: UserService
  ) {}

  /**
   * @returns true if user is logged in
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * @returns auth token for current user
   */
  get auth(): string {
    return this.token;
  }

  /**
   * Attempts to find user data stored in browser
   * If found, will attempt to validate the token
   */
  autologin(): void {
    const authData: {
      token: string;
      tokenExpirationDate: string;
    } = LocalStorageService.getItem(LocalStorageTypes.LOCAL, "userData");
    // Don't log in if no auth data or is expired
    if (!authData || new Date() > new Date(authData.tokenExpirationDate)) {
      return;
    } else {
      this.validateToken(authData.token).subscribe();
    }
  }

  /**
   * Validates token by requesting user information from squacapi
   *
   * @param token user token
   * @returns Currently logged in user
   */
  validateToken(token: string): Observable<User> {
    this.token = token;
    return this.userService.getUser().pipe(
      tap({
        next: () => {
          this.handleAuth(token);
        },
        error: () => {
          this.logout();
        },
      })
    );
  }

  /**
   * After user submits login data, send to squacapi
   *
   * @param email user email
   * @param password user password
   * @returns new User information if succesful
   */
  login(email: string, password: string): Observable<User> {
    const params: UserTokenCreateRequestParams = {
      data: {
        email,
        password,
      },
    };
    return this.api.userTokenCreate(params).pipe(
      switchMap((resData) => {
        return this.validateToken(resData.token);
      }),
      tap(() => {
        // redirect to existing url if page refresh
        if (this.redirectUrl) {
          this.router.navigate([this.redirectUrl]);
          this.redirectUrl = null;
        } else {
          this.router.navigate(["/"]);
        }
      })
    );
  }

  /**
   * Log user out, remove cached data and token
   */
  logout(): void {
    this.userService.logout();
    this.token = null;
    this.router.navigate(["/login"]);

    LocalStorageService.invalidateCache();
  }

  /**
   * After succesful login, save user data
   *
   * @param token user token
   */
  private handleAuth(token: string): void {
    const msToExpire = DEFAULT_MAX_LOGIN * 60 * 60 * 1000;
    const expirationDate = new Date(new Date().getTime() + msToExpire);
    const authData = {
      token,
      tokenExpirationDate: expirationDate,
    };
    LocalStorageService.setItem(LocalStorageTypes.LOCAL, "userData", authData);
  }
}
