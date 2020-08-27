import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Dashboard } from '../../models/dashboard';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { ViewService } from '@core/services/view.service';
import { MatDialog } from '@angular/material/dialog';
import { WidgetEditComponent } from '@features/widgets/components/widget-edit/widget-edit.component';
import * as moment from 'moment';
import { Ability } from '@casl/ability';
import { AppAbility } from '@core/utils/ability';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';

//
@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.scss']
})
export class DashboardDetailComponent implements OnInit, OnDestroy {
  @ViewChild(DaterangepickerDirective) datePicker: DaterangepickerDirective;
  dashboard: Dashboard;
  dialogRef;
  subscription: Subscription = new Subscription();
  status;
  maxDate: moment.Moment;
  error: string = null;
  unsaved: boolean = false;

  //TODO: make this a separate component, its making this too busy
  selected: {
    startDate,
    endDate
  };
  selectedRange: string;
  liveMode: boolean;
  startDate: moment.Moment;
  // settings for date select
  locale = {
    format: 'YYYY-MM-DDTHH:mm:ss.SSSS[Z]',
    displayFormat: 'YYYY/MM/DD HH:mm', // default is format value
    direction: 'ltr', // could be rtl
  };
  ranges = {};

  // annoying way to get date ranges and match squacapi
  // time duration (s) : label
  // TODO: this should be meaningful, not just seconds (i.e. 1 month != 30 days)
  // Get from squac?
  rangeLookUp = {
   900 : 'last 15 minutes',
   1800 : 'last 30 minutes',
   3600 : 'last 1 hour',
   43200 : 'last 12 hours',
   86400: 'last 24 hours',
   604800 : 'last 7 days',
   1209600 : 'last 14 days',
   2592000 : 'last 30 days'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewService: ViewService,
    private dialog: MatDialog,
    private ability: AppAbility
  ) { }

  ngOnInit() {
    this.maxDate = moment.utc();

    this.route.data.subscribe(
      data => {
        console.log(data.dashboard);
        this.dashboard = data.dashboard;
        if (this.dashboard) {
          this.viewService.dashboardSelected(this.dashboard);
          this.error = null;
          this.setInitialDates();
        } else {
          console.log("should not be possible tog et ehre");
        }
      }
    );

    const statusSub  = this.viewService.status.subscribe(
      status => {
        if(status !== this.status) {
          this.status = status;
          console.log('Status: ' + this.status);
        }

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


    // this.subscription.add(dashSub);
    // this.subscription.add(dashIdSub);
    this.subscription.add(statusSub);
    this.subscription.add(errorSub);
  }

  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe();
  // }\
  // FIXME: milliseconds of difference are causing it to not recognize
  lookupRange(startDate: moment.Moment, endDate: moment.Moment): number | void {
    if (Math.abs(endDate.diff(this.startDate)) < 1000 ) {
      this.liveMode = true;
      const diff = Math.round(endDate.diff(startDate) / 100000 ) * 100; // account for ms of weirdness
      this.selectedRange = this.rangeLookUp[diff];
      return diff;
    } else {
      this.liveMode = false;
      this.selectedRange = startDate.format('YYYY/MM/DD HH:mm') + ' - ' + endDate.format('YYYY/MM/DD HH:mm');
    }
  }

  datesSelected(chosenDate: {startDate: moment.Moment; endDate: moment.Moment }): void {
    if (chosenDate && chosenDate.startDate && chosenDate.endDate) {
      const range = this.lookupRange(chosenDate.startDate, chosenDate.endDate);
      this.selectDateRange(chosenDate.startDate, chosenDate.endDate, range ? range : null );
    }
  }

  setInitialDates() {
    this.startDate = moment.utc();
    // make date range selector
    for (const range in this.rangeLookUp) {
      if (this.rangeLookUp[range]) {
        this.ranges[this.rangeLookUp[range]] = [moment.utc().subtract(+range, 'seconds'), this.startDate];
      }
    }

    if (this.dashboard.timeRange) {
      this.liveMode = true;
      this.selected = {
        startDate: moment.utc().subtract(this.dashboard.timeRange, 'seconds'),
        endDate: this.startDate
      };
      // set default dates
    } else if (this.dashboard.starttime && this.dashboard.endtime) {
      this.liveMode = false;
      this.selected = {
        startDate: moment.utc(this.dashboard.starttime),
        endDate: moment.utc(this.dashboard.endtime)
      };
    } else {
      // default dates
      this.liveMode = true;
      this.selected = {
        startDate: this.ranges['last 1 hour'][0],
        endDate: this.startDate
      };
    }
  }

  openDatePicker(): void {
    this.datePicker.open();
  }

  editDashboard() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  // currently saves any time dates are changed, may want to move to a save button
  selectDateRange(startDate: moment.Moment, endDate: moment.Moment, range?: number) {
    this.viewService.datesChanged(
      startDate,
      endDate,
      this.liveMode,
      range
    );
    

    //FIXME: add check to keep it from saving on open
    if (this.ability.can('update', this.dashboard)) {
      this.saveDashboard();
    }

  }

  deleteDashboard() {
    if (this.ability.can('delete', this.dashboard)) {
      this.viewService.deleteDashboard(this.dashboard);
      this.router.navigate(['/dashboards']);
    }
  }

  refreshData() {
    this.viewService.refreshWidgets();
  }

  saveDashboard() {
    this.unsaved = false;
    this.viewService.saveDashboard();
  }

  ngOnDestroy() {
    console.log("dashboard detail destroyed")
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
        dashboardId: this.dashboard.id
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
