import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';
import { User } from './user';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  user: User;
  userForm: FormGroup;
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

    this.userForm = new FormGroup({
      firstname: new FormControl(
        this.user.firstname,
        Validators.required
        ),
      lastname: new FormControl(this.user.lastname, Validators.required),
      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });

    this.subscription.add(userSub);
  }

  changeUserInformation(password) {

    this.userService.updateUser(this.user, password).subscribe(
      user => {
        this.userService.fetchUser();
      },
      error => {
        console.log("error in change user: ", error);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
