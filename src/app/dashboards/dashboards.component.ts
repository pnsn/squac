import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardsService } from './dashboards.service';
import { Dashboard } from './dashboard';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit, OnDestroy {


  constructor(
    private dashboardsService: DashboardsService,
  ) {

  }

  ngOnInit() {
    this.dashboardsService.fetchDashboards();
    // TODO: first or favorited dashboard
    // this.router.navigate([this.dashboards[0].id], {relativeTo: this.route});

  }

  ngOnDestroy(): void {
  }
}
