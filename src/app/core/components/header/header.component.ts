import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { User } from '@features/user/models/user';
import { UserService } from '@features/user/services/user.service';
import { MessageService } from '@core/services/message.service';

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
    private authService: AuthService,
    private messageService: MessageService
  ) { }


  ngOnInit() {
    this.userSub = this.userService.user.subscribe(
      (user: User) => {
        this.user = user;
      },
      error => {
        this.messageService.error('Could not load user information.');
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
