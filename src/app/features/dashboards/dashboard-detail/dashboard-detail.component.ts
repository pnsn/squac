import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dashboard } from '../dashboard';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { ViewService } from '@core/services/view.service';
import { MatDialog } from '@angular/material/dialog';
import { WidgetEditComponent } from '../../widgets/components/widget-edit/widget-edit.component';
import * as moment from 'moment'; 

// 
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
  selectedRange : string;
  locale = {
    format: 'YYYY-MM-DDTHH:mm:ss.SSSS[Z]', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
    displayFormat: 'YYYY/MM/DD HH:mm', // default is format value
    direction: 'ltr', // could be rtl
}


  ranges: any = {
    'last 15 minutes': [moment().utc().subtract(15, 'minutes'), moment().utc()],
    'last 30 minutes': [moment().utc().subtract(30, 'minutes'), moment().utc()],
    'last 1 hour': [moment().utc().subtract(1, 'hour'), moment().utc()],
    'last 12 hours': [moment().utc().subtract(12, 'hours'), moment().utc()],
    'last 24 hours': [moment().utc().subtract(24, 'hours'), moment().utc()],
    'last 7 days': [moment().utc().subtract(7, 'days'), moment().utc()],
    'last 14 days': [moment().utc().subtract(14, 'days'), moment().utc()],
    'last 30 days': [moment().utc().subtract(30, 'days'), moment().utc()]
};

//lookup by seconds to get range key

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewService: ViewService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    const currentTime = moment.utc();
    console.log("current", currentTime)
    //if no dates, default to last 1 hour for quick loading
    const dashSub = this.viewService.currentDashboard.subscribe(
      (dashboard: Dashboard) => {
        this.dashboard = dashboard;
        if(this.dashboard) {
          console.log(dashboard)
          this.error = null;

          console.log(dashboard.starttime)
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

  lookupRange(startDate: moment.Moment, endDate: moment.Moment) {
    console.log(endDate === this.ranges['last 15 minutes'][1], this.ranges['last 15 minutes'][1])
    return "";
  }

  rangeSelected(event){
    this.selectedRange = event.label;
    console.log("range", event.label)
  }

  setInitialDates() {
    if(this.dashboard.timeRange) {
      this.selected = {
        startDate: moment().utc().subtract(this.dashboard.timeRange, "seconds"),
        endDate: moment().utc()
      }
      //set default dates
    } else if(this.dashboard.starttime && this.dashboard.endtime){
      console.log("has dates", this.dashboard.starttime)
      this.selected = {
        startDate: moment(this.dashboard.starttime).utc(),
        endDate: moment(this.dashboard.endtime).utc()
      };
    } else {
      //default dates
      console.log("no dates")
      this.selected = {
        startDate: this.ranges['last 1 hour'][0],
        endDate: this.ranges['last 1 hour'][1]
      };

    }
  }

  datesChanged(dates) {
    console.log("changed", dates)
  }

  chosenDate(chosenDate: {startDate: moment.Moment; endDate: moment.Moment }): void {
    console.log("chosen date")
    this.selectedRange = this.lookupRange(chosenDate.startDate, chosenDate.endDate);
    if(chosenDate && chosenDate.startDate && chosenDate.endDate) {
      this.selectDateRange(chosenDate.startDate, chosenDate.endDate);
    }
  }

  editDashboard() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  selectDateRange(startDate: moment.Moment, endDate:moment.Moment) {
    this.dashboard.starttime = startDate.format('YYYY-MM-DDTHH:mm:ss[Z]');
    this.dashboard.endtime = endDate.format('YYYY-MM-DDTHH:mm:ss[Z]');
    this.viewService.datesChanged(
      this.dashboard.starttime,
      this.dashboard.endtime
    );
    //only if able to
    this.saveDashboard();
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
