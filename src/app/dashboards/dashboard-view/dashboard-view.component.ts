import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DashboardsService } from '../dashboards.service';
import { Subscription } from 'rxjs';
import { Dashboard } from '../dashboard';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss']
})
export class DashboardViewComponent implements OnInit, OnDestroy {
  dashboards: Dashboard[];
  subscription: Subscription = new Subscription();
  activeDashboardId: number;
  constructor(
    private dashboardsService: DashboardsService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    const dashboardsSub = this.route.params.subscribe(
      (params: Params) => {
        this.activeDashboardId = +params.id;
      }
    );
    const dashboardsService = this.dashboardsService.getDashboards.subscribe(
      (dashboards: Dashboard[]) => {
        this.dashboards = dashboards;
        if(dashboards && dashboards[0] && !this.activeDashboardId) {
          //TODO: user favorite dashboard
          this.router.navigate([dashboards[0].id], {relativeTo: this.route});
        }

      }
    );

    this.subscription.add(dashboardsService);

    this.subscription.add(dashboardsSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  newDashboard() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

}
