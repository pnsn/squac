import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Dashboard } from "../../models/dashboard";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ViewService } from "@core/services/view.service";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";
import { AppAbility } from "@core/utils/ability";
import { DaterangepickerDirective } from "ngx-daterangepicker-material";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { DateService } from "@core/services/date.service";

//
@Component({
  selector: "app-dashboard-detail",
  templateUrl: "./dashboard-detail.component.html",
  styleUrls: ["./dashboard-detail.component.scss"],
})
export class DashboardDetailComponent implements OnInit, OnDestroy {
  @ViewChild(DaterangepickerDirective, { static: false })
  datePicker: DaterangepickerDirective;
  dashboard: Dashboard;
  subscription: Subscription = new Subscription();
  status;
  startDate: dayjs.Dayjs;
  maxDate: dayjs.Dayjs;
  error: string = null;
  unsaved = false;
  archiveType: string;
  archiveStat: string;
  archiveStatTypes: string[] = [
    "min",
    "max",
    "mean",
    "median",
    "stdev",
    "num_samps",
    "p05",
    "p10",
    "p90",
    "p95",
    "minabs",
    "maxabs",
  ];
  // TODO: make this a separate component, its making this too busy
  selected: {
    startDate;
    endDate;
  };
  selectedRange: string;
  liveMode: boolean;

  // settings for date select
  locale;
  ranges = {};
  // annoying way to get date ranges and match squacapi
  // time duration (s) : label
  // TODO: this should be meaningful, not just seconds (i.e. 1 month != 30 days)
  // Get from squac?
  rangeLookUp;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewService: ViewService,
    private ability: AppAbility,
    private confirmDialog: ConfirmDialogService,
    private dateService: DateService
  ) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault("Etc/UTC");
  }

  get rangeKeys() {
    return Object.keys(this.ranges);
  }

  ngOnInit() {
    this.rangeLookUp = this.dateService.dateRanges;
    this.maxDate = this.dateService.now();
    this.startDate = this.dateService.now();
    this.makeTimeRanges();
    this.locale = this.dateService.locale;
    const dashboardSub = this.route.data.subscribe((data) => {
      this.status = "loading";
      this.dashboard = data.dashboard;
      if (data.dashboard.error) {
        this.viewService.status.next("error");
      } else {
        this.viewService.setDashboard(this.dashboard);
        const range = this.viewService.range;
        const start = this.viewService.startdate;
        const end = this.viewService.enddate;
        this.archiveStat = this.dashboard.archiveStat;
        this.archiveType = this.dashboard.archiveType;
        if (range && this.rangeLookUp) {
          this.selectedRange = this.rangeLookUp[range];

          this.selected = {
            startDate: this.dateService.subtractFromNow(range, "seconds"),
            endDate: this.dateService.now(),
          };
        } else {
          this.selected = {
            startDate: this.dateService.parseUtc(start),
            endDate: this.dateService.parseUtc(end),
          };
          this.selectedRange = start + " - " + end;
        }

        this.error = null;
      }
    });

    const statusSub = this.viewService.status.subscribe(
      (status) => {
        this.status = status;
      },
      (error) => {
        console.log("error in dasbhboard detail status" + error);
      }
    );

    const errorSub = this.viewService.error.subscribe((error) => {
      this.error = error;
    });

    this.subscription.add(dashboardSub);
    this.subscription.add(statusSub);
    this.subscription.add(errorSub);
  }

  makeTimeRanges() {
    for (const range in this.rangeLookUp) {
      if (this.rangeLookUp[range]) {
        this.ranges[this.rangeLookUp[range]] = [
          this.dateService.subtractFromNow(+range, "seconds"),
          this.startDate,
        ];
      }
    }
  }

  selectArchiveType(type, stat) {
    this.archiveType = type;
    this.archiveStat = stat;
    this.unsaved = true;
    this.viewService.setArchive(this.archiveType, this.archiveStat);
  }
  // FIXME: milliseconds of difference are causing it to not recognize
  lookupRange(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs): number | void {
    const diff = this.dateService.diff(endDate, startDate);
    // check if end of range close to now
    if (Math.abs(diff) < 1) {
      this.liveMode = true;
      const roundDiff = Math.round(diff / 100) * 100; // account for ms of weirdness
      this.selectedRange = this.rangeLookUp[roundDiff];
      return roundDiff;
    } else {
      this.liveMode = false;
      this.selectedRange =
        this.dateService.displayFormat(startDate) +
        " - " +
        this.dateService.displayFormat(startDate);
    }
  }

  datesSelected(chosenDate: {
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
  }): void {
    let start = chosenDate.startDate;
    let end = chosenDate.endDate;

    if (start && end) {
      start = this.dateService.correctForLocal(start);
      end = this.dateService.correctForLocal(end);
    }

    this.unsaved = true;
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
    console.log("open");
    this.datePicker.open();
  }

  editDashboard() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  addWidget() {
    this.router.navigate(["widgets", "new"], { relativeTo: this.route });
  }

  // currently saves any time dates are changed, may want to move to a save button
  selectDateRange(
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
    _range?: number
  ) {
    this.selected.startDate = this.dateService.toUtc(startDate);
    this.selected.endDate = this.dateService.toUtc(endDate);
  }

  deleteDashboard() {
    this.confirmDialog.open({
      title: `Delete: ${this.dashboard.name}`,
      message: "Are you sure? This action is permanent.",
      cancelText: "Cancel",
      confirmText: "Delete",
    });
    this.confirmDialog.confirmed().subscribe((confirm) => {
      if (confirm) {
        this.viewService.deleteDashboard(this.dashboard.id);
        this.router.navigate(["/dashboards"]);
      }
    });
  }

  refreshData() {
    this.viewService.refreshWidgets();
  }

  save() {
    if (this.ability.can("update", this.dashboard)) {
      this.unsaved = false;
      this.viewService.saveDashboard();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
