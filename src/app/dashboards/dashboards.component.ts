import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardsService } from './dashboards.service';
import { Dashboard } from './dashboard';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit {
  dashboards: Dashboard[];
  subscription: Subscription = new Subscription();

  constructor(
    private dashboardsService: DashboardsService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.dashboardsService.fetchDashboards();
    //TODO: first or favorited dashboard
    // this.router.navigate([this.dashboards[0].id], {relativeTo: this.route});
    const dashboardsService = this.dashboardsService.getDashboards.subscribe(
      (dashboards: Dashboard[]) => {
        this.dashboards = dashboards;
      }
    );

    this.subscription.add(dashboardsService);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  newDashboard() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }
}
