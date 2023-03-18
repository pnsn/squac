import {
  AfterViewInit,
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
        { prop: "breachingChannels", props: ["channel"] },
        {
          prop: "monitor",
          props: [
            "name",
            "stat",

            { prop: "channelGroup", props: ["name"] },
            { prop: "metric", props: ["name"] },
          ],
        },
      ],
    },
  };

  options: TableOptions = {
    messages: {
      emptyMessage: "No alerts found.",
    },
    footerLabel: "Alerts",
  };

  @ViewChild("stateTemplate") public stateTemplate: TemplateRef<any>;
  @ViewChild("triggerTemplate") public triggerTemplate: TemplateRef<any>;
  @ViewChild("updateTemplate") public updateTemplate: TemplateRef<any>;
  @ViewChild("channelsTemplate") public channelsTemplate: TemplateRef<any>;
  @ViewChild("monitorTemplate") public monitorTemplate: TemplateRef<any>;

  constructor(
    private alertService: AlertService,
    private route: ActivatedRoute,
    private dateService: DateService,
    public loadingService: LoadingService
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
        sortable: false,
        width: 60,
        minWidth: 60,
        canAutoResize: false,
        cellTemplate: this.stateTemplate,
      },
      {
        name: "Time",
        prop: "",
        canAutoResize: false,
        cellTemplate: this.updateTemplate,
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
        sortable: false,
        width: 150,
        canAutoResize: false,
        cellTemplate: this.channelsTemplate,
      },
    ];
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
