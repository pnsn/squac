import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../auth/user.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
 
  user : {name: string, email: string};

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }


  ngOnInit() {
    this.userSub = this.userService.userInfo.subscribe(user => {
      this.user = user;
    });
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
