import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from './core/services/user.service';
import { AuthService } from './core/services/auth.service';
import { OrganizationsService } from '@core/services/organizations.service';

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
    private userService: UserService,
    private authService: AuthService,
    private organizationsService: OrganizationsService
  ) {}


  ngOnInit() {
    // Listen to log in
    const userSub = this.userService.user.subscribe(
      user => {
        this.organizationsService.fetchOrganizations();
        console.log(user)
        this.loggedIn = !!user;

      },
      err => {
        console.log('error in auth component: ' + err);
      }
    );
    // start autologin process
    this.authService.autologin();
    this.subscription.add(userSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
