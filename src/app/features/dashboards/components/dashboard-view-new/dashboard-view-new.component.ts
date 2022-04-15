import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";
import { Dashboard } from "../../models/dashboard";
import { UserService } from "@features/user/services/user.service";
import { ColumnMode } from "@swimlane/ngx-datatable";

@Component({
  selector: "app-dashboard-view-new",
  templateUrl: "./dashboard-view-new.component.html",
  styleUrls: ["./dashboard-view-new.component.scss"],
})
export class DashboardViewNewComponent implements OnInit, OnDestroy {
  dashboards: Dashboard[];
  subscription: Subscription = new Subscription();
  activeDashboardId: number;
  userId: number;
  orgId: number;
  ColumnMode = ColumnMode;
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const activeDashboardSub = this.route.params.subscribe(
      (params: Params) => {
        this.activeDashboardId = +params.dashboardId;
      },
      (error) => {
        console.log("error in dashboard view " + error);
      }
    );

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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  newDashboard() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }
}
