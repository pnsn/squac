import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Dashboard } from '../dashboard';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { ViewService } from '@core/services/view.service';
import { MatDialog } from '@angular/material/dialog';
import { WidgetEditComponent } from '../../widgets/components/widget-edit/widget-edit.component';
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
  id: number;
  dashboard: Dashboard;
  dialogRef;
  subscription: Subscription = new Subscription();
  status;
  maxDate: moment.Moment;
  error: string = null;
  unsaved: boolean;
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
    // if no dates, default to last 1 hour for quick loading
    const dashSub = this.viewService.currentDashboard.subscribe(
      (dashboard: Dashboard) => {
        this.dashboard = dashboard;
        if (this.dashboard) {
          this.error = null;
          this.setInitialDates();
        }
        // set dashboard dates
        // should have dates strings at this point, if not default to something
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

  lookupRange(startDate: moment.Moment, endDate: moment.Moment): number | void {
    if (Math.abs(endDate.diff(this.startDate)) < 1000 ) {
      this.liveMode = true;
      const diff = Math.round(endDate.diff(startDate) / 1000 ); // account for ms of weirdness
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
        this.ranges[this.rangeLookUp[range]] = [moment.utc().subtract(parseInt(range, 10), 'seconds'), this.startDate];
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

    if (this.ability.can('update', this.dashboard)) {
      this.saveDashboard();
    }

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
    this.viewService.saveDashboard();
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
