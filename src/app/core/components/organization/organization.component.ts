import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
  isAdmin: boolean;
  organization: Organization;
  addUserForm : FormGroup;
  editUserForm : FormGroup;
  userAdded: User;
  subscription: Subscription = new Subscription();
  error: string;
  @ViewChild('userTable') table: any;
  ColumnMode = ColumnMode;
  expanded: any = {};
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
          this.isAdmin = user.isAdmin;
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

    this.editUserForm = this.formBuilder.group({
      editGroups: [[], Validators.required],
      editIsAdmin: [null, Validators.required]
    });

    this.subscription.add(userSub)
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  saveUser(row){
    const values = this.editUserForm.value;
    this.orgService.updateUser(
      {
        email: row.email,
        orgId: this.organization.id,
        groups: values.groups,
        isAdmin: values.isAdmin,
        id: row.id
      }
    ).subscribe(
      newUser => {
        // this.userAdded = newUser;
        this.editUserForm.reset();
        // this.organization.users.push(newUser);
      },
      error => {
        this.error = error;
      }
    );

  }

  cancelUserEdit(row) {
    //clear userForm;
    console.log("cancel");
    this.editUserForm.reset();
    this.table.rowDetail.toggleExpandRow(row);
  }

  expandRow(row) {

    //row is open populate form
    console.log('Toggled Expand Row!', row);
    this.editUserForm.reset();
    this.table.rowDetail.collapseAllRows();

    this.table.rowDetail.toggleExpandRow(row);

    this.editUserForm.patchValue(
      {
        editGroups : row.groups,
        editIsAdmin: row.isAdmin
      }
    );
  }

  addNewUser() {
    const values = this.addUserForm.value;
    this.orgService.updateUser(
      {
        email: values.email,
        orgId: this.organization.id,
        groups: values.groups,
        isAdmin: values.isAdmin
      }
    ).subscribe(
      newUser => {
        this.userAdded = newUser;
        this.addUserForm.reset();
        // this.organization.users.push(newUser);
      },
      error => {
        this.error = error;
      }
    );


  }
}
