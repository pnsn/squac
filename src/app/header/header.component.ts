import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/user';

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
