import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dashboard } from '../dashboard';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { ViewService } from 'src/app/core/services/view.service';
import { MatDialog } from '@angular/material/dialog';
import { WidgetEditComponent } from '../../widgets/components/widget-edit/widget-edit.component';


@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.scss']
})
export class DashboardDetailComponent implements OnInit, OnDestroy {
  id: number;
  dashboard: Dashboard;
  dialogRef;
  subscription: Subscription = new Subscription();
  status = 'finished';

  // todo: make a date select
  dateRanges = [
    {
      name: 'last 30 minutes',
      value: 0.5
    },
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
  selectedDateRange; // Default date range
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
      (dashboard: Dashboard) => {
        this.error = null;
        this.dashboard = dashboard;
      },
      error => {
        this.error = 'Could not load dashboard.';
        console.log('error in dashboard detail: ' + error);
      }
    );

    const dashIdSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.error = null;
        this.selectedDateRange = this.dateRanges[1];
        this.viewService.dashboardSelected(this.id, this.calcDateRange(this.selectedDateRange.value), new Date());
        console.log('new dashboard ' + this.id);
      },
      error => {
        this.error = 'Could not load dashboard.';
        console.log('error in dashboard detail route: ' + error);
      }
    );

    const statusSub  = this.viewService.status.subscribe(
      status => {
        this.status = status;
        console.log('Status: ' + this.status);
      },
      error => {
        console.log('error in dasbhboard detail status' + error);
      }
    );

    const errorSub = this.viewService.error.subscribe(
      error => {
        this.error = error;
      }
    );


    this.subscription.add(dashSub);
    this.subscription.add(dashIdSub);
    this.subscription.add(statusSub);
    this.subscription.add(errorSub);
  }

  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe();
  // }

  editDashboard() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  selectDateRange(event) {
    this.viewService.datesChanged(
      this.calcDateRange(event.value.value),
      new Date()
    );
  }

  deleteDashboard() {
    this.viewService.deleteDashboard(this.dashboard);
    this.router.navigate(['/dashboards']);
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


  ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.subscription.unsubscribe();
  }


  addWidget() {
    // this.router.navigate(['widget', 'new'], {relativeTo: this.route});
    this.dialogRef = this.dialog.open(WidgetEditComponent, {
      data : {
        widget: null,
        dashboardId: this.id
      }
    });
    this.dialogRef.afterClosed().subscribe(
      result => {
        if (result && result.id) {
          console.log('Dialog closed and widget saved');
          this.viewService.addWidget(result.id);
        } else {
          console.log('Dialog closed and not saved');
        }
      },
      error => {
        // this.error = 'Failed to save widget.';
        console.log('error during close of widget' + error);
      }
    );

    }
}
