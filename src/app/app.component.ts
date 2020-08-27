import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from './core/services/auth.service';
import { LoadingService } from '@core/services/loading.service';


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
  loading: boolean;
  constructor(
    private authService: AuthService,
    private loadingService: LoadingService
  ) {}


  ngOnInit() {
    // // Listen to log in
    // const userSub = this.authService.userLoggedIn.subscribe(
    //   loggedIn => {
    //     this.loggedIn = loggedIn;
    //   },
    //   err => {
    //     console.log('error in auth component: ' + err);
    //   }
    // );

    // const loadingSub = this.loadingService.loading.subscribe(
    //   loading =>{
    //     this.loading = loading;
    //   }
    // );
    // start autologin process
    this.authService.autologin();
    // this.subscription.add(userSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
