import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { OrganizationsService } from '@core/services/organizations.service';
import { User } from '@core/models/user';
import { Organization } from '@core/models/organization';
import { flatMap, switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit, OnDestroy {
  user : User;
  organization: Organization;
  addUserForm : FormGroup;
  userAdded: User;
  subscription: Subscription = new Subscription();
  error: string;

  ColumnMode = ColumnMode;

  constructor(
    private userService: UserService,
    private orgService : OrganizationsService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    const userSub = this.userService.user.pipe(
      switchMap(
        user => {
          console.log("have a user")
          this.user = user;
          return this.orgService.getOrganizationById(this.user.orgId);
        }
      )
    ).subscribe(
      (org: Organization) => {
        console.log("doing org stuff")
        this.organization = org;
      }
    );

    this.addUserForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      isAdmin: [false, Validators.required],
      groups: ['', Validators.required]
    });
    this.subscription.add(userSub)
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  onSubmit() {
    const values = this.addUserForm.value;
    this.orgService.addUserToOrganization(
      {
        email: values.email,
        orgId: this.organization.id,
        groups: [values.groups],
        isAdmin: values.isAdmin
      }
    ).subscribe(
      newUser => {
        this.userAdded = newUser;
        this.organization.users.push(newUser);
      },
      error => {
        this.error = error;
      }
    );


  }
}
