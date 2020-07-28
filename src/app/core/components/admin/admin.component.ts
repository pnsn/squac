import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { OrganizationsService } from '@core/services/organizations.service';
import { User } from '@core/models/user';
import { Organization } from '@core/models/organization';
import { flatMap, switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  user : User;
  organization: Organization;
  addUserForm : FormGroup;

  constructor(
    private userService: UserService,
    private orgService : OrganizationsService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userService.user.pipe(
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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      isAdmin: [false, Validators.required]
    });
  }

  onSubmit() {
    const values = this.addUserForm.value;
    this.orgService.addUserToOrganization(
      new User(
        null,
        values.email,
        values.firstName,
        values.lastName,
        this.organization.id,
        values.isAdmin
      )
    ).subscribe(
      newUser => {
        this.organization.users.push(newUser);
      }
    );


  }
  //get user 
  // get organizations
  // select organization to edit
  // configure squac subpage?
  // edit organization route
}
