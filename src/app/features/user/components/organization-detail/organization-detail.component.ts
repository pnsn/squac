import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from "@angular/core";
import { OrganizationsService } from "@features/user/services/organizations.service";
import { User } from "@features/user/models/user";
import { Organization } from "@features/user/models/organization";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { InviteService } from "@features/user/services/invite.service";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "@core/services/message.service";

@Component({
  selector: "app-organization",
  templateUrl: "./organization-detail.component.html",
  styleUrls: ["./organization-detail.component.scss"],
})
export class OrganizationDetailComponent
  implements OnInit, OnDestroy, AfterViewInit
{
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
  @ViewChild("editTemplate") editTemplate: TemplateRef<any>;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  expanded: any = {};
  rows;
  columns;
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
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const orgSub = this.route.data.subscribe((data) => {
      this.user = this.route.parent.snapshot.data.user;
      this.organization = data.organization;
      this.rows = [...this.organization.users];
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

  ngAfterViewInit() {
    if (this.isAdmin) {
      this.columns = [
        {
          name: "",
          prop: "id",
          cellTemplate: this.editTemplate,
          canAutoResize: false,
          width: 50,
          sortable: false,
        },
        {
          name: "Name",
          prop: "",
          // canAutoResize: false,
          // width: 70,
          pipe: {
            transform: this.namePipe,
          },
        },
        {
          name: "Email", //FIXME: admin only
          draggable: false,
        },
        {
          name: "Groups",
          pipe: {
            transform: (groups) => {
              return groups ? groups.join(", ") : "";
            },
          },
        },
        {
          //FIXME: admin only
          name: "Last Login",
          prop: "lastLogin",
          pipe: {
            transform: this.datePipe,
          },
          canAutoResize: false,
          width: 100,
        },
        {
          name: "Is Admin",
          prop: "isAdmin",
          canAutoResize: false,
          width: 100,
        },
        {
          name: "Is Active", //Admin only
          prop: "isActive",
          canAutoResize: false,
          width: 100,
        },
      ];
    } else {
      this.columns = [
        {
          name: "Name",
          prop: "",
          // canAutoResize: false,
          // width: 70,
          pipe: {
            transform: this.namePipe,
          },
        },
        {
          name: "Groups",
          pipe: {
            transform: (groups) => {
              return groups ? groups.join(", ") : "";
            },
          },
        },
        {
          name: "Is Admin",
          prop: "isAdmin",
          canAutoResize: false,
          width: 100,
        },
        {
          name: "Is Active", //Admin only
          prop: "isActive",
          canAutoResize: false,
          width: 100,
        },
      ];
    }
  }

  datePipe(value: string) {
    return value ? new Date(value).toLocaleString("en-US").split(",")[0] : "";
  }

  namePipe(row: any) {
    return row ? row.firstName + " " + row.lastName : "";
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
      () => {
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
        this.rows = [...this.organization.users];
      });
  }

  sendInvite(id) {
    this.inviteService.sendInviteToUser(id).subscribe(
      () => {
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
