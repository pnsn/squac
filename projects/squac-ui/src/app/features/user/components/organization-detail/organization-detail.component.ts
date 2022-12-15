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
import { Observable } from "rxjs";
import {
  MenuAction,
  TableControls,
  TableFilters,
  TableOptions,
} from "@shared/components/table-view/interfaces";

/**
 * Displays info for single organization, mostly list of users
 */
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

  controls: TableControls = {
    resource: "Organization",
    add: {
      text: "Add User", //      *ngIf="isAdmin"
      path: "user",
    },
    menu: null,
    refresh: true,
    links: [{ text: "View All Organizations", path: "../" }],
  };

  filters: TableFilters = {};

  options: TableOptions = {
    autoRouteToDetail: false,
    messages: {
      emptyMessage: "No users found.",
    },
    footerLabel: "Users",
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

  /**
   * init data and user info
   */
  ngOnInit(): void {
    const orgSub = this.route.data
      .pipe(
        tap(() => {
          this.user = this.route.snapshot.data["user"];
          this.orgId = this.route.snapshot.params["orgId"];
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

  /** Set timeout used to get around angular weirdness */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.buildColumns();
    }, 0);
  }

  /**
   * Get new organization data
   *
   * @param refresh true if cache should not be used
   * @returns Observable of current organization
   */
  fetchData(refresh?: boolean): Observable<Organization> {
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

  /**
   * Make columns for table
   */
  buildColumns(): void {
    if (this.isAdmin) {
      this.columns = [
        {
          name: "Name",
          prop: "",
          // canAutoResize: false,
          // width: 70,
          pipe: {
            transform: (row): string => {
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
            transform: (groups): string => {
              return groups ? groups.join(", ") : "";
            },
          },
        },
        {
          name: "Last Login",
          prop: "lastLogin",
          pipe: {
            transform: (value): string => {
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
            transform: (row): string => {
              return row ? row.firstName + " " + row.lastName : "";
            },
          },
        },
        {
          name: "Groups",
          pipe: {
            transform: (groups): string => {
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

  /**
   * Click event from table
   *
   * @param event html click event
   */
  onClick(event: MenuAction): void {
    if (event === "deactivate" && this.selectedId) {
      this.deactivateUser();
    } else if (event === "invite" && this.selectedId) {
      this.sendInvite();
    }
  }

  /**
   * User selected in table
   *
   * @param row selected row with user info
   */
  onSelect(row: User): void {
    this.selectedId = row.id;
    this.selected = row;
  }

  /**
   * Marks users as inactive and sends to squacapi
   */
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

  /** Refreshes data */
  refresh(): void {
    this.fetchData(true).subscribe();
  }

  /**
   * Sends invitation to selected user
   */
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

  /** unsubscribe */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
