import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { OrganizationService } from "@user/services/organization.service";
import { User } from "@user/models/user";
import { Organization } from "@user/models/organization";
import { Subscription } from "rxjs";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { InviteService } from "@user/services/invite.service";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "@core/services/message.service";

@Component({
  selector: "user-organization-detail",
  templateUrl: "./organization-detail.component.html",
  styleUrls: ["./organization-detail.component.scss"],
})
export class OrganizationDetailComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  user: User;
  isAdmin: boolean;
  organization: Organization;
  userAdded: User;
  inviteSent: boolean;
  subscription: Subscription = new Subscription();
  error: string;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  expanded: any = {};
  rows;
  columns;
  selectedId;
  selected: User;

  controls = {
    resource: "Organization",
    add: {
      text: "Add User", //      *ngIf="isAdmin"
      path: "user",
    },
    menu: {},
    refresh: true,
    links: [{ text: "View All Organizations", path: "../" }],
  };

  filters = {};

  options = {
    autoRouteToDetail: false,
    messages: {
      emptyMessage: "No users found.",
    },
    footerLabel: "Users",
    selectionType: "single",
  };

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
    private orgService: OrganizationService,
    private inviteService: InviteService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const orgSub = this.route.data.subscribe((data) => {
      this.user = this.route.parent.snapshot.data.user;
      if (data.organization && data.organization.users) {
        this.organization = data.organization;
        this.rows = [...this.organization.users];
      }

      this.isAdmin =
        this.user.isStaff ||
        (this.user.orgAdmin && this.user.orgId === this.organization.id);
    });

    if (this.isAdmin) {
      this.controls.menu = {
        text: "Actions",
        path: "user",
        options: [
          {
            text: "Edit",
            permission: "update",
            action: "edit",
          },
          {
            text: "Send Invite",
            action: "invite",
          },
          {
            text: "Deactivate",
            permission: "delete",
            action: "deactivate",
          },
        ],
      };
    }

    this.subscription.add(orgSub);
  }
  buildColumns() {
    if (this.isAdmin) {
      this.columns = [
        {
          name: "Name",
          prop: "",
          // canAutoResize: false,
          // width: 70,
          pipe: {
            transform: (row) => {
              return row ? row.firstName + " " + row.lastName : "";
            },
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
            transform: (value) => {
              return value
                ? new Date(value).toLocaleString("en-US").split(",")[0]
                : "";
            },
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
            transform: (row) => {
              return row ? row.firstName + " " + row.lastName : "";
            },
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
  ngAfterViewInit() {
    setTimeout(() => {
      this.buildColumns();
    }, 0);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClick(event) {
    if (event === "deactivate" && this.selectedId) {
      this.deactivateUser();
    } else if (event === "invite" && this.selectedId) {
      this.sendInvite();
    }
  }

  onSelect(row: User) {
    this.selectedId = row.id;
    this.selected = row;
  }

  deactivateUser() {
    if (this.selected) {
      this.selected.isActive = false;
      this.orgService.updateUser(this.selected).subscribe({
        next: () => {
          this.messageService.message("User deactivated.");
          this.refresh();
        },
        error: (error) => {
          this.messageService.error(error);
        },
      });
    }
  }

  refresh() {
    this.orgService
      .getOrganizationUsers(this.organization.id)
      .subscribe((users) => {
        this.organization.users = users;
        this.rows = [...this.organization.users];
      });
  }
  sendInvite() {
    this.inviteService.sendInviteToUser(this.selectedId).subscribe({
      next: () => {
        this.messageService.message("Invitation email sent.");
        this.refresh();
      },
      error: (error) => {
        this.messageService.error(error);
      },
    });
  }
}
