import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dashboard } from '../dashboard';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { ViewService } from '@core/services/view.service';
import { MatDialog } from '@angular/material/dialog';
import { WidgetEditComponent } from '../../widgets/components/widget-edit/widget-edit.component';
import * as moment from 'moment'; 

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
  status;

  error: string = null;
  unsaved: boolean;
  selected : {
    startDate,
    endDate
  };

  locale = {
    format: 'MM/DD/YYYY', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
    displayFormat: 'YYYY/MM/DD', // default is format value
    direction: 'ltr', // could be rtl
}


  ranges: any = {
    'last 15 minutes': [moment().subtract(15, 'minutes'), moment()],
    'last 30 minutes': [moment().subtract(30, 'minutes'), moment()],
    'last 1 hour': [moment().subtract(1, 'hour'), moment()],
    'last 12 hours': [moment().subtract(12, 'hours'), moment()],
    'last 24 hours': [moment().subtract(24, 'hours'), moment()],
    'last 7 days': [moment().subtract(7, 'days'), moment()],
    'last 14 days': [moment().subtract(14, 'days'), moment()],
    'last 30 days': [moment().subtract(30, 'days'), moment()]
};

//lookup by seconds to get range key

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewService: ViewService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    //if no dates, default to last 1 hour for quick loading
    const dashSub = this.viewService.currentDashboard.subscribe(
      (dashboard: Dashboard) => {

        if(dashboard) {
          this.error = null;
          this.dashboard = dashboard;
          this.setInitialDates();
        }
        //set dashboard dates
        //should have dates strings at this point, if not default to something
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
        this.viewService.dashboardSelected(this.id);
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
  // }\

  rangeSelected(event){
    console.log("range", event)
  }

  setInitialDates() {
    if(this.dashboard.timeRange) {
      //set default dates
    } else if(this.dashboard.starttime && this.dashboard.endtime){
      console.log("has dates")
      this.selected = {
        startDate: moment(this.dashboard.starttime).utc(),
        endDate: moment(this.dashboard.endtime).utc()
      };
    } else {
      //default dates
      console.log("no dates")
      this.selected = {
        startDate: moment().utc(),
        endDate: moment().utc()
      };
    }
  }

  datesChanged(dates) {
    console.log("changed", dates)
  }

  chosenDate(chosenDate: { chosenLabel: string; startDate: moment.Moment; endDate: moment.Moment }): void {
    if(chosenDate && chosenDate.startDate && chosenDate.endDate) {
      this.selectDateRange(chosenDate.startDate, chosenDate.endDate);
    }
  }

  editDashboard() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  selectDateRange(startDate: moment.Moment, endDate:moment.Moment) {
    this.dashboard.starttime = startDate.format('yyyy-MM-ddTHH:mm:ssZ');
    this.dashboard.endtime = endDate.format('yyyy-MM-ddTHH:mm:ssZ');
    this.viewService.datesChanged(
      this.dashboard.starttime,
      this.dashboard.endtime
    );
  }

  deleteDashboard() {
    this.viewService.deleteDashboard(this.dashboard);
    this.router.navigate(['/dashboards']);
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
