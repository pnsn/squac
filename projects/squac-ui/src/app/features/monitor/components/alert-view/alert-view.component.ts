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
import { MonitorService } from "squacapi";
import {
  catchError,
  EMPTY,
  forkJoin,
  Subscription,
  switchMap,
  tap,
} from "rxjs";
import { Observable } from "rxjs";
import {
  TableControls,
  TableFilters,
  TableOptions,
} from "@shared/components/table-view/interfaces";

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

  // Table config
  rows = [];
  columns = [];

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
    setTimeout(() => {
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
    }, 0);
  }

  /**
   * Get fresh alerts and monitors
   *
   * @param refresh true if cache should not be used
   * @returns Obsercable of monitors and alerts
   */
  fetchData(refresh?: boolean): Observable<any> {
    const lastDay = this.dateService.subtractFromNow(1, "day").format();
    return this.loadingService.doLoading(
      this.alertService.list({ timestampGte: lastDay }, refresh).pipe(
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
