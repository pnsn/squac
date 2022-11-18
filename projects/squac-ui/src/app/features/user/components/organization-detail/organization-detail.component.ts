import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { OrganizationService } from "squacapi";
import { User } from "squacapi";
import { Organization } from "squacapi";
import { catchError, EMPTY, Subscription, switchMap, tap } from "rxjs";
import { InviteService } from "squacapi";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "@core/services/message.service";
import { LoadingService } from "@core/services/loading.service";
import { OrganizationUserService } from "squacapi";

@Component({
  selector: "user-organization-detail",
  templateUrl: "./organization-detail.component.html",
  styleUrls: ["./organization-detail.component.scss"],
})
export class OrganizationDetailComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  subscription: Subscription = new Subscription();
  organization: Organization;
  orgId: number;
  user: User;
  isAdmin: boolean;

  userAdded: User;
  inviteSent: boolean;
  error: string;

  // table config
  rows = [];
  columns = [];
  selectedId: number;
  selected: User;

  controls = {
    resource: "Organization",
    add: {
      text: "Add User", //      *ngIf="isAdmin"
      path: "user",
    },
    menu: null,
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

  // group options
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
    private orgUserService: OrganizationUserService,
    private inviteService: InviteService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    const orgSub = this.route.data
      .pipe(
        tap(() => {
          this.user = this.route.snapshot.data.user;
          this.orgId = this.route.snapshot.params.orgId;
        }),
        switchMap(() => {
          return this.fetchData();
        }),
        tap(() => {
          this.isAdmin =
            this.user.isStaff ||
            (this.user.orgAdmin && this.user.orgId === this.organization.id);
          // this.error = false;
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
        })
      )
      .subscribe();

    this.subscription.add(orgSub);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.buildColumns();
    }, 0);
  }

  fetchData(refresh?: boolean) {
    return this.loadingService
      .doLoading(this.orgService.read(this.orgId, refresh), this)
      .pipe(
        tap((results: Organization) => {
          this.organization = results;
          this.rows = [...this.organization.users];
        }),
        catchError(() => {
          return EMPTY;
        })
      );
  }
  // make columns for table
  buildColumns(): void {
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

  // click event from table
  onClick(event): void {
    if (event === "deactivate" && this.selectedId) {
      this.deactivateUser();
    } else if (event === "invite" && this.selectedId) {
      this.sendInvite();
    }
  }

  // select event from table
  onSelect(row: User): void {
    this.selectedId = row.id;
    this.selected = row;
  }

  // send deactivation for user
  deactivateUser(): void {
    if (this.selected) {
      this.selected.isActive = false;
      this.orgUserService.updateOrCreate(this.selected).subscribe({
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

  // get fresh user info
  refresh(): void {
    this.fetchData(true).subscribe();
  }

  // send invitation to user
  sendInvite(): void {
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
