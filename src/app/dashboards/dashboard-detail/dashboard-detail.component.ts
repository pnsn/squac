import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dashboard } from '../dashboard';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DashboardsService } from '../dashboards.service';
import { Widget } from '../widget';
import { Subscription, Subject } from 'rxjs';
import { WidgetsService } from '../widgets.service';

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
    private dashboardsService: DashboardsService,
    private widgetsService: WidgetsService
  ) { }

  ngOnInit() {
    const dashboardsSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.updateDashboard();

      }
    );

    const widgetSub = this.widgetsService.widgetUpdated.subscribe(widgetId => {
      this.updateDashboard();
      //TODO: update just the widget
    });

    this.subscription.add(dashboardsSub);
    this.subscription.add(widgetSub);
  }

  updateDashboard() {
    this.subscription.add(this.dashboardsService.getDashboard(this.id).subscribe(
      dashboard => {
        this.dashboard = dashboard;
        this.startdate = '2019-10-18';
        this.enddate = '2019-10-31';
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  editDashboard() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  updateWidget(id) {
    console.log("refresh widget", id)
    //refresh the widget
  }

  refreshData() {
    // send refresh request to widgets listening
    this.reload.next(true);
  }

  addWidget() {
    this.router.navigate(['widget', 'new'], {relativeTo: this.route});
  }
}
