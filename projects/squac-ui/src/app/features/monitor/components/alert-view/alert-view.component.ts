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

  controls = {
    listenToRouter: true,
    resource: "Monitor",
    add: {
      text: "Add Monitor",
      path: "/monitors",
    },
    refresh: true,
    links: [{ text: "View All Monitors", path: "/monitors" }],
  };

  filters = {
    dateFilter: {},
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

  options = {
    messages: {
      emptyMessage: "No alerts found.",
    },
    footerLabel: "Alerts",
  };

  @ViewChild("stateTemplate") public stateTemplate: TemplateRef<any>;
  @ViewChild("triggerTemplate") public triggerTemplate: TemplateRef<any>;
  @ViewChild("updateTemplate") public updateTemplate: TemplateRef<any>;
  @ViewChild("channelsTemplate") public channelsTemplate: TemplateRef<any>;

  constructor(
    private alertService: AlertService,
    private route: ActivatedRoute,
    private monitorService: MonitorService,
    private dateService: DateService,
    public loadingService: LoadingService
  ) {}

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
          canAutoResize: false,
          width: 150,
          pipe: {
            transform: (monitor): string => {
              return monitor.name;
            },
          },
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
          width: 50,
          cellTemplate: this.channelsTemplate,
        },
      ];
    }, 0);
  }

  fetchData(refresh?: boolean): Observable<any> {
    const lastDay = this.dateService.subtractFromNow(1, "day").format();
    return this.loadingService.doLoading(
      forkJoin({
        alerts: this.alertService.list({ timestampGte: lastDay }, refresh),
        monitors: this.monitorService.list({}, refresh),
      }).pipe(
        tap((results: any) => {
          this.monitors = results.monitors;
          this.findMonitorForAlerts(results.alerts);
        }),
        catchError(() => {
          return EMPTY;
        })
      ),
      this
    );
  }
  // get fresh data
  refresh(): void {
    this.fetchData(true).subscribe();
  }

  // match alerts and monitors
  findMonitorForAlerts(alerts: Alert[]): void {
    this.alerts = [];
    if (this.monitors.length > 0 && alerts.length > 0) {
      this.alerts = alerts.map((alert) => {
        alert.monitor = this.monitors.find(
          (m) => m.id === alert.trigger.monitorId
        );
        return alert;
      });
    }
    this.rows = [...this.alerts];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    clearInterval(this.interval);
  }
}