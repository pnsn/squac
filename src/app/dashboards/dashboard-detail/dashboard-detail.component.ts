import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dashboard } from '../dashboard';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DashboardsService } from '../dashboards.service';
import { Widget } from '../widget';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.scss']
})
export class DashboardDetailComponent implements OnInit, OnDestroy {

  id: number;
  dashboard: Dashboard;
  widgets: Widget[];
  subscription: Subscription = new Subscription();
  reload: Subject<boolean> = new Subject();
  startdate: string;
  enddate: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardsService: DashboardsService
  ) { }

  ngOnInit() {
    const dashboardsSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.dashboardsService.getDashboard(this.id).subscribe(
          dashboard => {
            this.dashboard = dashboard;
            this.startdate = '2019-10-01';
            this.enddate = '2019-10-31';
            console.log('dashboard resolved');
          }
        );

      }
    );

    this.subscription.add(dashboardsSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  editDashboard() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  refreshData() {
    // send refresh request to widgets listening
    this.reload.next(true);
  }

  addWidget() {
    this.router.navigate(['widget', 'new'], {relativeTo: this.route});
  }
}
