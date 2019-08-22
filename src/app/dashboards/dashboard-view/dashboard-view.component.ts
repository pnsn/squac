import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardsService } from '../dashboards.service';
import { Subscription } from 'rxjs';
import { Dashboard } from '../dashboard';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss']
})
export class DashboardViewComponent implements OnInit {
  dashboards: Dashboard[];
  subscription: Subscription = new Subscription();

  constructor(
    private dashboardsService: DashboardsService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    const dashboardsService = this.dashboardsService.getDashboards.subscribe(
      (dashboards: Dashboard[]) => {
        this.dashboards = dashboards;
      }
    );

    this.subscription.add(dashboardsService);
    this.dashboardsService.fetchDashboards();
    //TODO: first or favorited dashboard
    // this.router.navigate([this.dashboards[0].id], {relativeTo: this.route});

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  newDashboard() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

}
