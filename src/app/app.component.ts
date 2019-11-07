import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

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
  constructor(private authService: AuthService) {

  }

  // Check if logged in
  ngOnInit() {
   const authSub = this.authService.user.subscribe(user => {
      this.loggedIn = !!user;
    });

   this.authService.autologin();

   this.subscription.add(authSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
