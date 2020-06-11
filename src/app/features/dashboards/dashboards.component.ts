import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardsService } from './dashboards.service';
import { Dashboard } from './dashboard';
import { Router, ActivatedRoute } from '@angular/router';
import { StatTypeService } from '../../core/services/stattype.service';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit, OnDestroy {
  opened = true;

  constructor(
    private dashboardsService: DashboardsService,
    private statTypeService: StatTypeService
  ) {

  }

  ngOnInit() {
    // TODO: load before routing
    this.dashboardsService.fetchDashboards();
    this.statTypeService.fetchStatTypes();
  }

  ngOnDestroy(): void {
  }
}
