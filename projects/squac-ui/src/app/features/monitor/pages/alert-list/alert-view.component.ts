import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, RouterLink, RouterOutlet } from "@angular/router";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import { Alert } from "squacapi";
import { Monitor } from "squacapi";
import { AlertService } from "squacapi";
import { catchError, EMPTY, Subscription, switchMap, tap } from "rxjs";
import { Observable } from "rxjs";
import {
  TableColumn,
  TableControls,
  TableFilters,
  TableOptions,
} from "@shared/components/table-view/interfaces";
import { DATE_PICKER_TIMERANGES } from "@dashboard/pages/detail/dashboard-time-ranges";
import { PageOptions } from "@shared/components/detail-page/detail-page.interface";
import { DetailPageComponent } from "@shared/components/detail-page/detail-page.component";
import { TableViewComponent } from "@shared/components/table-view/table-view.component";
import { LoadingDirective } from "@shared/directives/loading-directive.directive";
import { AsyncPipe, NgIf, NgStyle } from "@angular/common";
import { DateSelectComponent } from "@shared/components/date-select/date-select.component";
import { MonitorAlarmStatusComponent } from "@monitor/components/monitor-alarm-status/monitor-alarm-status.component";

/**
 * Component for viewing list of alerts
 */
@Component({
  selector: "monitor-alert-view",
  templateUrl: "./alert-view.component.html",
  standalone: true,
  imports: [
    DetailPageComponent,
    TableViewComponent,
    LoadingDirective,
    AsyncPipe,
    DateSelectComponent,
    RouterOutlet,
    MonitorAlarmStatusComponent,
    RouterLink,
    NgIf,
    NgStyle,
  ],
})
export class AlertViewComponent implements OnInit, OnDestroy, AfterViewInit {
  /** rxjs subscriptions */
  subscription = new Subscription();
  /** alerts to display */
  alerts: Alert[];
  /** monitors to display */
  monitors: Monitor[];
  /** true if date has been changed */
  unsavedChanges = false;
  /** default time range for alert requests */
  timeRange: number = 1 * 24 * 60 * 60;
  // time picker config
  datePickerTimeRanges = DATE_PICKER_TIMERANGES;
  /** starttime for request */
  starttime: string;
  /** end time for config */
  endtime: string;
  // Table config
  /** table rows */
  rows = [];
  /** table columns */
  columns: TableColumn[] = [];
  /** search params */
  params: {
    timestampGte: string;
    timestampLt?: string;
  };

  /** Config for detail page */
  pageOptions: PageOptions = {
    path: "/alerts",
  };

  /** config for table component */
  controls: TableControls = {
    listenToRouter: true,
    resource: "Monitor",
    add: {
      text: "Add Monitor",
      path: "/monitors",
    },
    refresh: true,
    links: [{ text: "View All Monitors", path: "/monitors" }],
  };

  /** config for search field */
  filters: TableFilters = {
    searchField: {
      text: "Filter alerts...",
      props: [
        "owner",
        "monitorName",
        { prop: "breachingChannels", props: ["channel"] },
      ],
    },
  };

  /** config for table */
  options: TableOptions = {
    autoRouteToDetail: false,
    messages: {
      emptyMessage: "No alerts found.",
    },
    footerLabel: "Alerts",
  };

  /** template for alert state */
  @ViewChild("stateTemplate") stateTemplate: TemplateRef<any>;
  /** template for trigger column */
  @ViewChild("triggerTemplate") triggerTemplate: TemplateRef<any>;
  /** template for channels column */
  @ViewChild("channelsTemplate") channelsTemplate: TemplateRef<any>;
  /** template for monitor column */
  @ViewChild("monitorTemplate") monitorTemplate: TemplateRef<any>;
  constructor(
    private alertService: AlertService,
    private route: ActivatedRoute,
    private dateService: DateService,
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   *
   */
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    this.columns = [
      {
        name: "State",
        columnDef: "inAlarm",
        cellTemplate: this.stateTemplate,
      },
      {
        name: "Time",
        columnDef: "timestamp",
      },
      {
        name: "Monitor",
        columnDef: "monitorName",
        cellTemplate: this.monitorTemplate,
      },
      {
        name: "Trigger",
        columnDef: "trigger",
        cellTemplate: this.triggerTemplate,
      },
      {
        name: "Breaching Channels",
        columnDef: "breachingChannels",
        cellTemplate: this.channelsTemplate,
      },
    ];
    this.cdr.detectChanges();
  }
  /** subscribe to route events */
  ngOnInit(): void {
    const monitorsSub = this.route.params
      .pipe(
        switchMap(() => {
          return this.fetchData();
        })
      )
      .subscribe();

    this.subscription.add(monitorsSub);
  }

  /**
   * Dates emitted when user changes time ranges, updates
   * dates in widget manager
   *
   * @param root0 emitted dates
   * @param root0.startDate time range start date
   * @param root0.endDate end of time range
   * @param root0._liveMode is time range live
   * @param root0.rangeInSeconds width of time range
   */
  datesChanged({ startDate, endDate, _liveMode, rangeInSeconds }): void {
    if (!startDate || !endDate) {
      startDate = this.dateService.subtractFromNow(rangeInSeconds, "seconds");
      endDate = this.dateService.now();
    }

    this.params = {
      timestampGte: this.dateService.format(startDate),
      timestampLt: this.dateService.format(endDate),
    };

    this.unsavedChanges = true;
  }

  /**
   * Initiates data fetch
   */
  update(): void {
    this.fetchData().subscribe();
  }
  /**
   * Get fresh alerts and monitors
   *
   * @param refresh true if cache should not be used
   * @returns Obsercable of monitors and alerts
   */
  fetchData(refresh?: boolean): Observable<any> {
    if (!this.params) {
      const lastDay = this.dateService.subtractFromNow(1, "day").format();
      this.params = {
        timestampGte: lastDay,
      };
    }

    return this.loadingService.doLoading(
      this.alertService.list(this.params, refresh).pipe(
        tap((alerts: Alert[]) => {
          this.alerts = alerts;
          this.rows = [...this.alerts];
        }),
        catchError(() => {
          return EMPTY;
        })
      ),
      this
    );
  }

  /** Get fresh data */
  refresh(): void {
    this.fetchData(true).subscribe();
  }

  /** unsubscribe */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
