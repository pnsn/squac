import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { UserService } from './auth/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

// App parent component
export class AppComponent implements OnInit, OnDestroy {
  title = 'squac-ui';
  loggedIn: boolean;
  subscription = new Subscription();
  constructor(
    private authService: AuthService, 
    private userService: UserService) {

  }

  // Check if logged in
  ngOnInit() {
    const authSub = this.authService.auth.subscribe(auth => {
      this.loggedIn = !!auth;
    });

    this.authService.autologin();

    this.subscription.add(authSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
