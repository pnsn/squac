import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { OrganizationsService } from '@core/services/organizations.service';
import { User } from '@core/models/user';
import { Organization } from '@core/models/organization';
import { flatMap, switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  user : User;
  organization: Organization;
  addUserForm : FormGroup;
  userAdded: User;
  subscription: Subscription = new Subscription;
  error: string;
  constructor(
    private userService: UserService,
    private orgService : OrganizationsService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    const userSub = this.userService.user.pipe(
      switchMap(
        user => {
          this.user = user;
          return this.orgService.getOrganizationById(this.user.orgId);
        }
      )
    ).subscribe(
      (org: Organization) => {
        this.organization = org;
      }
    );

    this.addUserForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      isAdmin: [false, Validators.required]
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
  //get user 
  // get organizations
  // select organization to edit
  // configure squac subpage?
  // edit organization route
}
