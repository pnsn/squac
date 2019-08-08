import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardsService } from '../shared/dashboards.service';
import { Dashboard } from '../shared/dashboard';
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
    this.dashboards = this.dashboardsService.getDashboards();
    this.subscription.add(this.dashboardsService.dashboardsChanged.subscribe(
      (dashboards: Dashboard[]) => {
        this.dashboards = dashboards;
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  newDashboard() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }
}
