import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { User } from '@features/user/models/user';
import { UserService } from '@features/user/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription;

  user: User;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }


  ngOnInit() {
    this.userSub = this.userService.user.subscribe(
      user => {
        this.user = user;
      },
      error => {
        console.log('error in header: ' + error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
  }
}
