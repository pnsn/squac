import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Dashboard } from '../../models/dashboard';
import { UserService } from '@features/user/services/user.service';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss']
})
export class DashboardViewComponent implements OnInit, OnDestroy {
  dashboards: Dashboard[];
  subscription: Subscription = new Subscription();
  activeDashboardId: number;
  userId: number;
  orgId: number;
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    const dashboardsSub = this.route.params.subscribe(
      (params: Params) => {
        this.activeDashboardId = +params.id;
      },
      error => {
        console.log('error in dashboard view ' + error);
      }
    );

    if (this.route.snapshot && this.route.snapshot.data) {
      this.dashboards = this.route.snapshot.data.dashboards;
    }

    const userService = this.userService.user.subscribe(
      user => {
        this.userId = user ? user.id : null;
        this.orgId = user ? user.orgId : null;
      }
    );
    // this.subscription.add(dashboardsService);
    this.subscription.add(userService);
    this.subscription.add(dashboardsSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  newDashboard() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

}
