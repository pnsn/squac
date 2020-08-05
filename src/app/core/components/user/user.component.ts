import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrganizationsService } from '@core/services/organizations.service';
import { Organization } from '@core/models/organization';
import { switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, Params } from '@angular/router';

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
  organization: Organization;
  id;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private orgService: OrganizationsService
  ) { }

  ngOnInit() {
    const paramsSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.editMode = !!this.id;
      },
      error => {
        console.log('error getting params: ' + error);
      }
    );

    const userSub = this.userService.user.pipe(
      switchMap(
        user => {
          console.log('have a user');
          if (!user) {
            this.userService.fetchUser();
            console.log('hfetch user?');
          } else {
            this.user = user;
            this.initForm(user);
          }
          return this.orgService.getOrganizationById(this.user.orgId);
        }
      )
    ).subscribe(
      (org: Organization) => {
        console.log('have a org?');
        this.organization = org;
      }
    );

    this.subscription.add(userSub);
  }

  initForm(user) {
    this.userForm = new FormGroup({
      firstName: new FormControl(
        user.firstName,
        Validators.required
        ),
      lastName: new FormControl(user.lastName, Validators.required),
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
