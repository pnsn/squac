import { Component, OnInit, OnDestroy } from "@angular/core";
import { OrganizationService } from "squacapi";
import { User } from "squacapi";
import { Organization } from "squacapi";
import { catchError, EMPTY, Subscription, tap } from "rxjs";
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
import { PageOptions } from "@shared/components/detail-page/detail-page.interface";

/**
 * Displays info for single organization, mostly list of users
 */
@Component({
  selector: "user-organization-detail",
  templateUrl: "./organization-detail.component.html",
  styleUrls: ["./organization-detail.component.scss"],
})
export class OrganizationDetailComponent implements OnInit, OnDestroy {
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

  /** Config for detail page */
  pageOptions: PageOptions = {
    path: "user",
    titleButtons: {},
  };

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
        tap((data) => {
          this.user = this.route.snapshot.data["user"];
          this.orgId = this.route.snapshot.params["orgId"];
          this.organization = data["organization"];
          this.rows = [...this.organization.users];

          this.isAdmin =
            this.user.isStaff ||
            (this.user.isOrgAdmin && this.user.orgId === this.organization.id);

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
          this.buildColumns();
        })
      )
      .subscribe();

    this.subscription.add(orgSub);
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
    this.columns = [
      {
        name: "Name",
        prop: "",
        // canAutoResize: false,
        // width: 70,
        pipe: {
          transform: (row: User): string => {
            return row ? row.firstname + " " + row.lastname : "";
          },
        },
      },
      {
        name: "Groups",
        pipe: {
          transform: (groups): string => {
            return groups ? Array.from(groups).join(", ") : "";
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

    if (this.isAdmin) {
      this.columns.splice(1, 0, {
        name: "Email", //FIXME: admin only
        draggable: false,
      });
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
      error: () => {
        this.messageService.error("Error: invitation could not be sent.");
      },
    });
  }

  /** unsubscribe */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
