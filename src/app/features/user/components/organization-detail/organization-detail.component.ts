import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from "@angular/core";
import { OrganizationService } from "@user/services/organization.service";
import { User } from "@user/models/user";
import { Organization } from "@user/models/organization";
import { Subscription, tap } from "rxjs";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { InviteService } from "@user/services/invite.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { MessageService } from "@core/services/message.service";
import { filter } from "rxjs";

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
  selectedId;
  selected = [];
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
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const orgSub = this.route.data.subscribe((data) => {
      this.user = this.route.parent.snapshot.data.user;
      if (this.organization && this.organization.users) {
        this.organization = data.organization;
        this.rows = [...this.organization.users];
      }

      this.isAdmin =
        this.user.isStaff ||
        (this.user.orgAdmin && this.user.orgId === this.organization.id);
    });

    const routerEvents = this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        tap((e: NavigationEnd) => {
          if (
            e.urlAfterRedirects.toString() ===
            `/user/organizations/${this.organization.id}`
          ) {
            this.refreshOrgUsers();
          }
        })
      )
      .subscribe();
    this.subscription.add(routerEvents);
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
  ngAfterViewInit() {
    setTimeout(this.buildColumns, 0);
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

  addUser(id: number) {
    if (id) {
      this.router.navigate(["user", id, "edit"], { relativeTo: this.route });
    } else {
      this.router.navigate(["user", "new"], { relativeTo: this.route });
    }
  }

  refreshOrgUsers() {
    this.orgService
      .getOrganizationUsers(this.organization.id)
      .subscribe((users) => {
        this.organization.users = users;
        this.rows = [...this.organization.users];
      });
  }

  // onSelect function for data table selection
  onSelect($event) {
    const selectedId = $event.selected[0].id;
    if (selectedId) {
      // this.router.navigate([selectedId, "edit"], { relativeTo: this.route });
      this.selectedId = selectedId;
      this.selectUser(selectedId);
    }
  }

  selectUser(selectedId) {
    this.selected = this.rows.filter((d) => {
      // Select row with channel group
      return d.id === selectedId;
    });
  }
  //deactivateUser

  activate() {
    console.log("activate user");
  }

  sendInvite() {
    this.inviteService.sendInviteToUser(this.selectedId).subscribe({
      next: () => {
        this.messageService.message("Invitation email sent.");
        this.refreshOrgUsers();
      },
      error: (error) => {
        console.log(error);
        this.messageService.error(error);
      },
    });
  }
}
