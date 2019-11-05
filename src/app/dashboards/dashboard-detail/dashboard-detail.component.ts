import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Dashboard } from '../dashboard';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DashboardsService } from '../dashboards.service';
import { Widget } from '../../widgets/widget';
import { Subscription, Subject } from 'rxjs';
import { WidgetComponent } from 'src/app/widgets/widget.component';

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

  @ViewChild(WidgetComponent, {static: false})
  private widgetComponent: WidgetComponent;

  dateRanges = [
    {
      name: 'last hour',
      value: 1
    },
    {
      name: 'last 24 hours ',
      value: 24
    },
    {
      name: 'last week',
      value: 24 * 7
    },
    {
      name: 'last 2 weeks',
      value: 168 * 2
    }
  ];
  startdate: Date;
  enddate: Date;
  selectedDateRange = this.dateRanges[2];
  editMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardsService: DashboardsService
  ) { }

  ngOnInit() {
    const dashboardsSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.enddate = new Date();
        this.startdate = this.calcDateRange(this.selectedDateRange.value);
        this.updateDashboard();

      }
    );
    this.subscription.add(dashboardsSub);
  }

  updateDashboard() {
    this.subscription.add(this.dashboardsService.getDashboard(this.id).subscribe(
      dashboard => {
        this.dashboard = dashboard;

      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  editDashboard() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  selectDateRange(event) {
    this.enddate = new Date();
    this.startdate = this.calcDateRange(event.value.value);
    setTimeout(() => {
      this.refreshData();
    }, 10);
  }

  calcDateRange(hours) {
    return new Date(new Date().getTime() - (hours * 60 * 60 * 1000));
  }

  refreshData() {
    // send refresh request to widgets listening
    this.widgetComponent.refresh();
  }



  cancelEdit() {
    this.editMode = false;
  }

  saveDashboard() {
    this.widgetComponent.save();
    this.dashboardsService.updateDashboard(this.dashboard).subscribe();
    this.cancelEdit();
  }
  addWidget() {
    this.router.navigate(['widget', 'new'], {relativeTo: this.route});
  }
  editWidgets() {
    this.editMode = true;
    // this.addWidget();
  }

}
