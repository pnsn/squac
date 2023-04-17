import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import { Alert } from "squacapi";
import { Monitor } from "squacapi";
import { AlertService } from "squacapi";
import { catchError, EMPTY, Subscription, switchMap, tap } from "rxjs";
import { Observable } from "rxjs";
import {
  TableControls,
  TableFilters,
  TableOptions,
} from "@shared/components/table-view/interfaces";
import { DATE_PICKER_TIMERANGES } from "@dashboard/components/dashboard-detail/dashboard-time-ranges";
import { sortTimestamps } from "@core/utils/utils";
import { PageOptions } from "@shared/components/detail-page/detail-page.interface";

/**
 * Component for viewing list of alerts
 */
@Component({
  selector: "monitor-alert-view",
  templateUrl: "./alert-view.component.html",
})
export class AlertViewComponent implements OnInit, OnDestroy, AfterViewInit {
  subscription = new Subscription();
  alerts: Alert[];
  monitors: Monitor[];
  refreshInProgress = false;
  interval;
  error: boolean;
  unsavedChanges = false;
  timeRange: number = 1 * 24 * 60 * 60;
  // time picker config
  datePickerTimeRanges = DATE_PICKER_TIMERANGES;
  starttime: string;
  endtime: string;
  // Table config
  rows = [];
  columns = [];
  params: {
    timestampGte: string;
    timestampLt?: string;
  };

  /** Config for detail page */
  pageOptions: PageOptions = {
    path: "/alerts",
  };

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

  options: TableOptions = {
    messages: {
      emptyMessage: "No alerts found.",
    },
    footerLabel: "Alerts",
  };

  @ViewChild("stateTemplate") stateTemplate: TemplateRef<any>;
  @ViewChild("triggerTemplate") triggerTemplate: TemplateRef<any>;
  @ViewChild("channelsTemplate") channelsTemplate: TemplateRef<any>;
  @ViewChild("monitorTemplate") monitorTemplate: TemplateRef<any>;
  constructor(
    private alertService: AlertService,
    private route: ActivatedRoute,
    private dateService: DateService,
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {}

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

  /** Set up columns */
  ngAfterViewInit(): void {
    this.columns = [
      {
        name: "State",
        prop: "inAlarm",
        width: 70,
        minWidth: 70,
        canAutoResize: false,
        cellTemplate: this.stateTemplate,
      },
      {
        name: "Time",
        prop: "timestamp",
        width: 160,
        canAutoResize: false,
        comparator: sortTimestamps,
      },
      {
        name: "Monitor",
        prop: "monitorName",
        width: 150,
        cellTemplate: this.monitorTemplate,
      },
      {
        name: "Trigger",
        width: 200,
        cellTemplate: this.triggerTemplate,
        sortable: false,
      },
      {
        name: "Breaching Channels",
        prop: "breachingChannels",
        width: 150,
        canAutoResize: false,
        cellTemplate: this.channelsTemplate,
      },
    ];
    this.cdr.detectChanges();
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
    clearInterval(this.interval);
  }
}
