import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { OrganizationsService } from "@features/user/services/organizations.service";
import { User } from "@features/user/models/user";
import { Organization } from "@features/user/models/organization";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription, of } from "rxjs";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { InviteService } from "@features/user/services/invite.service";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "@core/services/message.service";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";

@Component({
  selector: "app-organization",
  templateUrl: "./organization-detail.component.html",
  styleUrls: ["./organization-detail.component.scss"],
})
export class OrganizationDetailComponent implements OnInit, OnDestroy {
  user: User;
  isAdmin: boolean;
  organization: Organization;
  addUserForm: FormGroup;
  editUserForm: FormGroup;
  userAdded: User;
  inviteSent: boolean;
  subscription: Subscription = new Subscription();
  error: string;
  @ViewChild("userTable") table: any;
  ColumnMode = ColumnMode;
  expanded: any = {};

  groups = [
    {
      id: 1,
      role: "viewer",
      description: "can see all resources.",
    },
    {
      id: 2,
      role: "reporter",
      description: "can create dashboards, channel groups, and monitors.",
    },
    {
      id: 3,
      role: "contributor",
      description: "can add metrics and measurements.",
    },
  ];
  constructor(
    private orgService: OrganizationsService,
    private formBuilder: FormBuilder,
    private inviteService: InviteService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    const orgSub = this.route.data.subscribe((data) => {
      this.user = this.route.parent.snapshot.data.user;
      this.organization = data.organization;
      this.isAdmin =
        this.user.isStaff ||
        (this.user.orgAdmin && this.user.orgId === this.organization.id);
    });

    this.addUserForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      isAdmin: [false, Validators.required],
      groups: ["", Validators.required],
    });

    this.editUserForm = this.formBuilder.group({
      editGroups: [[], Validators.required],
      editIsAdmin: [false, Validators.required],
      editIsActive: [true, Validators.required],
    });

    this.subscription.add(orgSub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  saveUser(row) {
    const values = this.editUserForm.value;
    const user = new User(
      row.id,
      row.email,
      row.firstName,
      row.lastName,
      this.organization.id,
      values.editIsAdmin,
      values.editGroups
    );
    user.isActive = values.editIsActive;
    this.orgService.updateUser(user).subscribe(
      (savedUser) => {
        // this.userAdded = newUser;
        this.editUserForm.reset();
        this.table.rowDetail.toggleExpandRow(row);
        this.messageService.message(`Saved user ${row.email}`);
        // this.organization.users.push(newUser);
      },
      (error) => {
        this.messageService.error(`Could not save user ${row.email}`);
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
    this.editUserForm.patchValue({
      editGroups: row.groups,
      editIsAdmin: row.isAdmin,
      editIsActive: row.isActive,
    });
  }

  refreshOrgUsers() {
    this.orgService
      .getOrganizationUsers(this.organization.id)
      .subscribe((users) => {
        this.organization.users = users;
      });
  }

  sendInvite(id) {
    this.inviteService.sendInviteToUser(id).subscribe(
      (response) => {
        this.refreshOrgUsers();
      },
      (error) => {
        this.error = error;
      }
    );
  }

  addNewUser() {
    const values = this.addUserForm.value;
    this.orgService
      .updateUser(
        new User(
          null,
          values.email,
          null,
          null,
          this.organization.id,
          values.isAdmin,
          values.groups
        )
      )
      .subscribe(
        (newUser) => {
          this.userAdded = newUser;
          this.sendInvite(newUser.id);
          this.addUserForm.reset();
          // this.organization.users.push(newUser);
          this.messageService.message(`Added user ${values.email}`);
          // this.organization.users.push(newUser);
        },
        (error) => {
          this.messageService.error(`Could not add user ${values.email}`);
          this.error = error;
        }
      );
  }
}
