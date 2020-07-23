import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrganizationsService } from '@core/services/organizations.service';
import { Organization } from '@core/models/organization';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  user: User;
  userForm: FormGroup;
  subscription: Subscription = new Subscription();
  editMode: boolean;
  hide = true;
  organizations : Organization[];
  constructor(
    private userService: UserService,
    private orgService: OrganizationsService
  ) { }

  ngOnInit() {
    const userSub = this.userService.user.subscribe(
      user => {
        if (!user) {
          this.userService.fetchUser();
        } else {
          this.user = user;
          this.initForm(user);
        }

      },
      error => {
        console.log('error in user component: ' + error);
      }
    );

    //tODO: this should be done with lookup
    this.orgService.organizations.subscribe(
      organizations => {
        this.organizations = organizations;
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
      email: new FormControl(user.email, [Validators.required, Validators.email])
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
        console.log('error in change user: ', error);
      }
    );

  }

  getOrgName(id) {
    return this.organizations.find(
      org => org.id === id
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
