import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Dashboard } from '../../models/dashboard';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { ViewService } from '@core/services/view.service';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Ability } from '@casl/ability';
import { AppAbility } from '@core/utils/ability';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { ConfigurationService } from '@core/services/configuration.service';
import { config } from 'process';
import { OrganizationsService } from '@features/user/services/organizations.service';

//
@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.scss']
})
export class DashboardDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DaterangepickerDirective) datePicker: DaterangepickerDirective;
  dashboard: Dashboard;
  subscription: Subscription = new Subscription();
  status;
  maxDate: moment.Moment;
  error: string = null;
  unsaved = false;

  // TODO: make this a separate component, its making this too busy
  selected: {
    startDate,
    endDate
  };
  selectedRange: string;
  liveMode: boolean;
  startDate: moment.Moment;
  // settings for date select
  locale;
  ranges = {};
  // annoying way to get date ranges and match squacapi
  // time duration (s) : label
  // TODO: this should be meaningful, not just seconds (i.e. 1 month != 30 days)
  // Get from squac?
  rangeLookUp ;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewService: ViewService,
    private ability: AppAbility,
    private confirmDialog: ConfirmDialogService,
    configService: ConfigurationService,
  ) {
    this.rangeLookUp = configService.getValue('dateRanges');
    this.locale = configService.getValue('locale');
  }

  ngOnInit() {

    this.maxDate = moment.utc();
    this.startDate = moment.utc();
    this.makeTimeRanges();


    this.route.data.subscribe(
      data => {
        this.status = 'loading';
        this.dashboard = data.dashboard;
        if (data.dashboard.error) {
          this.viewService.status.next('error');
        } else {
          this.viewService.setDashboard(this.dashboard);
          const range = this.viewService.range;
          const start = this.viewService.startdate;
          const end = this.viewService.enddate;

          if (range && this.rangeLookUp) {
            this.selectedRange = this.rangeLookUp[range];
            this.selected = {
              startDate: this.ranges[this.selectedRange][0],
              endDate: this.ranges[this.selectedRange][1]
            };
          } else {
            this.selected = {
              startDate: moment.utc(start),
              endDate: moment.utc(end)
            };
            this.selectedRange = start + ' - ' + end;
          }
          this.error = null;
        }
      }
    );


    const statusSub  = this.viewService.status.subscribe(
      status => {
        this.status = status;
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

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.

  }

  makeTimeRanges(){
    for (const range in this.rangeLookUp) {
      if (this.rangeLookUp[range]) {
        this.ranges[this.rangeLookUp[range]] = [moment.utc().subtract(+range, 'seconds'), this.startDate];
      }
    }
  }

  // FIXME: milliseconds of difference are causing it to not recognize
  lookupRange(startDate: moment.Moment, endDate: moment.Moment): number | void {

    // check if end of range close to now
    if (Math.abs(endDate.diff(this.startDate)) < 1000 ) {

      this.liveMode = true;
      const diff = Math.round(endDate.diff(startDate) / 100000 ) * 100; // account for ms of weirdness
      this.selectedRange = this.rangeLookUp[diff];
      return diff;
    } else {
      this.liveMode = false;
      this.selectedRange = startDate.format(this.locale.displayFormat) + ' - ' + endDate.format(this.locale.displayFormat);
    }
  }

  datesSelected(chosenDate: {startDate: moment.Moment; endDate: moment.Moment }): void {
    this.unsaved = true;
    const start = chosenDate.startDate;
    const end = chosenDate.endDate;
    if (start && end) {
      const range = this.lookupRange(start, end);
      this.viewService.datesChanged(
        start,
        end,
        this.liveMode,
        range ? range : null
      );
    }
  }

  openDatePicker(): void {
    this.datePicker.open();
  }

  editDashboard() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }
  addWidget() {
    this.router.navigate(['widgets', 'new'], {relativeTo: this.route});

  }

  // currently saves any time dates are changed, may want to move to a save button
  selectDateRange(startDate: moment.Moment, endDate: moment.Moment, range?: number) {

  }

  deleteDashboard() {
    this.confirmDialog.open(
      {
        title: `Delete: ${this.dashboard.name}`,
        message: 'Are you sure? This action is permanent.',
        cancelText: 'Cancel',
        confirmText: 'Delete'
      }
    );
    this.confirmDialog.confirmed().subscribe(
      confirm => {
        if (confirm) {
          this.viewService.deleteDashboard(this.dashboard.id);
          this.router.navigate(['/dashboards']);
        }
    });
  }

  refreshData() {
    this.viewService.refreshWidgets();
  }

  save() {
    if (this.ability.can('update', this.dashboard)) {
      this.unsaved = false;
      this.viewService.saveDashboard();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
