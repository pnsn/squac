import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Dashboard } from '../dashboard';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DashboardsService } from '../dashboards.service';
import { Widget } from '../../widgets/widget';
import { Subscription, Subject } from 'rxjs';
import { WidgetComponent } from 'src/app/widgets/widget.component';
import { ViewService } from 'src/app/shared/view.service';
import { WidgetEditComponent } from 'src/app/widgets/widget-edit/widget-edit.component';
import { MatDialog } from '@angular/material/dialog';

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
  status = 'finished';
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
  selectedDateRange = this.dateRanges[2];
  error: string = null;
  unsaved: boolean;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewService: ViewService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

    const dashSub = this.viewService.currentDashboard.subscribe(
      dashboard => {
        this.error = null;
        this.dashboard = dashboard;
      },
      error => {
        this.error = "Could not load dashboard."
        console.log('error in dashboard detail: ' + error);
      }
    );

    const dashIdSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.error = null;
        this.viewService.dashboardSelected(this.id, this.calcDateRange(this.selectedDateRange.value), new Date());
        console.log('new dashboard');
      },
      error => {
        this.error = "Could not load dashboard.";
        console.log('error in dashboard detail route: ' + error);
      }
    );

    const statusSub  = this.viewService.status.subscribe(
      status => {
        this.status = status;
        console.log(this.status)
      },
      error => {
        console.log('error in dasbhboard detail status' + error);
      }
    );

    const errorSub = this.viewService.error.subscribe(
      error => {
        this.error = error;
      }
    )


    this.subscription.add(dashSub);
    this.subscription.add(dashIdSub);
    this.subscription.add(statusSub);
    this.subscription.add(errorSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  editDashboard() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  selectDateRange(event) {
    this.viewService.datesChanged(
      this.calcDateRange(event.value.value),
      new Date()
    );
  }

  calcDateRange(hours) {
    return new Date(new Date().getTime() - (hours * 60 * 60 * 1000));
  }

  refreshData() {
    this.viewService.refreshWidgets();
  }

  saveDashboard() {
    this.unsaved = false;
    this.viewService.saveDashboard(this.dashboard);
  }

  addWidget() {
    // this.router.navigate(['widget', 'new'], {relativeTo: this.route});
    const dialogRef = this.dialog.open(WidgetEditComponent, {
      data : {
        widget: null,
        dashboardId: this.dashboard.id
      }
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result && result.id) {
          console.log('Dialog closed and widget saved');
          this.viewService.addWidget(result.id);
        } else {
          console.log('Dialog closed and not saved');
        }
      },
      error => {
        this.error = "Failed to save widget.";
        console.log('error during close of widget' + error);
      }
    );

  }

}
