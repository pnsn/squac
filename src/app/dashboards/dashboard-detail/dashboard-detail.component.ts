import { Component, OnInit } from '@angular/core';
import { Dashboard } from '../dashboard';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DashboardsService } from '../dashboards.service';
import { Widget } from '../widget';

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.scss']
})
export class DashboardDetailComponent implements OnInit {

  id: number;
  dashboard: Dashboard;
  widgets: Widget[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardsService: DashboardsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.dashboardsService.getDashboard(this.id).subscribe(
          dashboard => {
            this.dashboard = dashboard;
            this.widgets = this.dashboard.widgets;
          }
        );

      }
    );
  }
  editDashboard() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  addWidget() {
    this.router.navigate(['widget', 'new'], {relativeTo: this.route});
  }
}
