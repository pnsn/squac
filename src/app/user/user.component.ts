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
  editMode : boolean;
  hide:boolean = true;
  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    const userSub = this.userService.user.subscribe(
      user => {
        if(!user) {
          this.userService.fetchUser();
        } else{
          this.user = user; 
          this.initForm(user);
        }

      },
      error => {
        console.log('error in user component: ' + error);
      }
    );



    this.subscription.add(userSub);
  }

  initForm(user) {
    this.userForm = new FormGroup({
      firstname: new FormControl(
        user.firstname,
        Validators.required
        ),
      lastname: new FormControl(user.lastname, Validators.required),
      email: new FormControl(user.email, [Validators.required, Validators.email]),
      organization: new FormControl(user.organization, [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  editForm() {
    this.editMode = true;
  }

  save() {
    
    this.userService.updateUser(this.userForm.value).subscribe(
      user => {
        this.userService.fetchUser();
        this.editMode = false;
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
