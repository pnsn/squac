import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';
import { User } from './user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  user: User;

  subscription: Subscription = new Subscription();
  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    const userSub = this.userService.user.subscribe(
      user => {
        this.user = user;
      },
      error => {
        console.log('error in user component: ' + error);
      }
    );

    this.subscription.add(userSub);
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
