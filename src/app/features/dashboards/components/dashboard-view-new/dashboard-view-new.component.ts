import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";
import { Dashboard } from "../../models/dashboard";
import { UserService } from "@features/user/services/user.service";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { UserPipe } from "@shared/pipes/user.pipe";
import { OrganizationPipe } from "@shared/pipes/organization.pipe";
import { OrganizationsService } from "@features/user/services/organizations.service";

@Component({
  selector: "app-dashboard-view-new",
  templateUrl: "./dashboard-view-new.component.html",
  styleUrls: ["./dashboard-view-new.component.scss"],
})
export class DashboardViewNewComponent implements OnInit, OnDestroy {
  dashboards: Dashboard[] = [];
  subscription: Subscription = new Subscription();
  activeDashboardId: number;
  userId: number;
  orgId: number;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  userPipe;
  orgPipe;
  selected = [];
  selectedId: number;
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private orgService: OrganizationsService
  ) {
    this.userPipe = new UserPipe(orgService);
    this.orgPipe = new OrganizationPipe(orgService);
  }

  ngOnInit() {
    const activeDashboardSub = this.route.params.subscribe({
      next: (params: Params) => {
        this.activeDashboardId = +params.dashboardId;
      },
      error: (error) => {
        console.log("error in dashboard view " + error);
      },
    });

    const dashboardsSub = this.route.data.subscribe((data) => {
      if (data.dashboards && data.dashboards.error) {
        console.log("error in dashboard");
      } else {
        this.dashboards = data.dashboards;
      }
    });

    const userService = this.userService.user.subscribe((user) => {
      this.userId = user ? user.id : null;
      this.orgId = user ? user.orgId : null;
    });
    // this.subscription.add(dashboardsService);
    this.subscription.add(userService);
    this.subscription.add(dashboardsSub);
    this.subscription.add(activeDashboardSub);
  }

  // onSelect function for data table selection
  onSelect($event) {
    // When a row is selected, route the page and select that channel group
    const selectedId = $event.selected[0].id;
    if (selectedId) {
      this.router.navigate([selectedId], { relativeTo: this.route });
      this.selectedId = selectedId;
      this.selectDashboard(selectedId);
    }
  }

  // Getting a selected channel group and setting variables
  selectDashboard(selectedId: number) {
    this.selected = this.dashboards.filter((d) => {
      // Select row with channel group
      return d.id === selectedId;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  newDashboard() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }
}
