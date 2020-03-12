import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user';
import { Router } from '@angular/router';
import { SquacApiService } from '../squacapi.service';
import { UserService } from './user.service';


// Data returned from server
export interface AuthResponseData {
  token: string;
}

@Injectable({
  providedIn: 'root'
})

// Handles log in logic and API requests for login
export class AuthService {
  private url = 'user/token/';
  auth = new BehaviorSubject<string>(null); // Currently active user
  private tokenExpirationTimer: any; // Time left before token expires

  constructor(
    private router: Router,
    private squacApi: SquacApiService,
    private userService: UserService
  ) { }

  // Checks if user data exists in browser
  autologin() {

    // Looks for local user data
    const authData: {
      token: string,
      tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));

    // if no data or the expiration date has passed
    if (!authData || new Date() > new Date(authData.tokenExpirationDate)) {
      return;
    } else {
      const expirationDuration = new Date(authData.tokenExpirationDate).getTime() - new Date().getTime();
      this.autologout(expirationDuration);
      this.userService.getUser();
      this.auth.next(authData.token);
    }
  }

  // after user enters data, log them in
  login(userEmail: string, userPassword: string) {
    return this.squacApi.post(this.url,
      {
        email : userEmail, 
        password : userPassword
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => {
        // TODO: Get expiration time from Jon
        this.handleAuth(resData.token, 7200);
      })
    );
  }

  // after user hits log out, wipe data
  logout() {
    this.userService.user.next(null);
    this.auth.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    // TODO: make sure all modals close
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  // Logs out user after expiration time passes
  autologout(expirationDuration: number) {
    console.log('expires in (Minutes)', expirationDuration / (1000 * 60));
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  // Handles login errors
  // TODO: match to errors passed from server
  private handleError(errorRes: HttpErrorResponse) {
    console.log(errorRes.error);
    let errorMessage = 'An unknown error occured!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Password invalid';
        break;
    }
    return throwError(errorMessage);
  }

  // after login, save user data
  private handleAuth(token: string, expiresIn: number) {
    this.userService.getUser();
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

    const authData = {
      token: token,
      tokenExpirationDate: expirationDate
    };

    localStorage.setItem('userData', JSON.stringify(authData));
    this.autologout(expiresIn * 1000);
    this.auth.next(authData.token);

  }
}
