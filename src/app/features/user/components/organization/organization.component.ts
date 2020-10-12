import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UserService } from '@features/user/services/user.service';
import { OrganizationsService } from '@features/user/services/organizations.service';
import { User } from '@features/user/models/user';
import { Organization } from '@features/user/models/organization';
import { flatMap, switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { InviteService } from '@features/user/services/invite.service';
import { ThrowStmt } from '@angular/compiler';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit, OnDestroy {
  user: User;
  isAdmin: boolean;
  organization: Organization;
  addUserForm: FormGroup;
  editUserForm: FormGroup;
  userAdded: User;
  inviteSent: boolean;
  subscription: Subscription = new Subscription();
  error: string;
  @ViewChild('userTable') table: any;
  ColumnMode = ColumnMode;
  expanded: any = {};

  groups = [
    {
      id: 1, role: 'viewer', description: 'can see all resources.'
    },
    {
      id: 2, role: 'reporter', description: 'can create dashboards and channel groups.'
    },
    {
      id: 3, role: 'contributor', description: 'can add metrics.'
    }
  ];
  constructor(
    private orgService: OrganizationsService,
    private formBuilder: FormBuilder,
    private inviteService: InviteService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.organization = this.route.snapshot.data.organization;
    this.user = this.route.parent.snapshot.data.user;
    this.isAdmin = this.user.isAdmin;

    this.addUserForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      isAdmin: [false, Validators.required],
      groups: ['', Validators.required]
    });

    this.editUserForm = this.formBuilder.group({
      editGroups: [[], Validators.required],
      editIsAdmin: [null, Validators.required]
    });

    // this.subscription.add(userSub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  saveUser(row) {
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
    this.editUserForm.reset();
    this.table.rowDetail.toggleExpandRow(row);
  }

  expandRow(row: User) {
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

  sendInvite(id) {
    this.inviteService.sendInviteToUser(id).subscribe(
      response => {
        console.log(response);
      },
      error => {
        this.error = error;
      }
    );
    console.log('send invite to user ', id);
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
        this.sendInvite(newUser.id);
        this.addUserForm.reset();
        // this.organization.users.push(newUser);
      },
      error => {
        this.error = error;
      }
    );


  }
}
