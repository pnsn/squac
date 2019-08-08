import { Component, OnInit } from '@angular/core';
import { Dashboard } from '../../shared/dashboard';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DashboardsService } from '../../shared/dashboards.service';

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.scss']
})
export class DashboardDetailComponent implements OnInit {

  id: number;
  dashboard: Dashboard;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private DashboardsService: DashboardsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.dashboard = this.DashboardsService.getDashboard(this.id);
      }
    )
  }
  editDashboard() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }
}
