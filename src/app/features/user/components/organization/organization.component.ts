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
import { MessageService } from '@core/services/message.service';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';

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
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmDialog: ConfirmDialogService
  ) { }

  ngOnInit(): void {
    const orgSub = this.route.data.subscribe(
      data => {
        this.user = this.route.parent.snapshot.data.user;
        this.organization = data.organization;
        this.isAdmin = this.user.isStaff || this.user.orgAdmin && this.user.orgId === this.organization.id;
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

    this.subscription.add(orgSub);
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
        groups: values.editGroups,
        isAdmin: values.editIsAdmin,
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
      }
    ).subscribe(
      savedUser => {
        // this.userAdded = newUser;
        this.editUserForm.reset();
        this.table.rowDetail.toggleExpandRow(row);
        this.messageService.message(`Saved user ${row.email}`);
        // this.organization.users.push(newUser);
      },
      error => {
        this.messageService.error(`Could not save user ${row.email}`);
        this.error = error;
      }
    );

  }

  deleteUser(row) {
    this.confirmDialog.open(
      {
        title: `Delete: ${row.email}`,
        message: 'Are you sure? This action is permanent.',
        cancelText: 'Cancel',
        confirmText: 'Delete'
      }
    );
    this.confirmDialog.confirmed().subscribe(
      confirm => {
        if (confirm) {
          this.orgService.deleteUser(row.id).subscribe(
            user => {
              this.messageService.message('User deleted.');
              this.table.rowDetail.toggleExpandRow(row);
              this.refreshOrgUsers();
            },
            error => {
              this.messageService.error('Could not delete user.');
            }
          );
        }
    });
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

  refreshOrgUsers() {
    this.orgService.getOrganizationUsers(this.organization.id).subscribe(
      users => {
        this.organization.users = users;
      }
    );

  }

  sendInvite(id) {
    this.inviteService.sendInviteToUser(id).subscribe(
      response => {
        console.log(response);
        this.refreshOrgUsers();
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
        this.messageService.message(`Added user ${values.email}`);
        // this.organization.users.push(newUser);
      },
      error => {
        this.messageService.error(`Could not add user ${values.email}`);
        this.error = error;
      }
    );


  }
}
