import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  user : {
    name : string, 
    email : string
  }

  subscription: Subscription;
  constructor(
    private userService : UserService
  ) { }

  ngOnInit() {
    const userSub = this.userService.userInfo.subscribe(
      user => {
        this.user = user;
      }
    );

    this.subscription.add(userSub)
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
