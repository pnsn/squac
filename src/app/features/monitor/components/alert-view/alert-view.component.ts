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
import { Alert } from "@monitor/models/alert";
import { Monitor } from "@monitor/models/monitor";
import { AlertService } from "@monitor/services/alert.service";
import { MonitorService } from "@monitor/services/monitor.service";
import {
  catchError,
  EMPTY,
  forkJoin,
  mergeMap,
  Subscription,
  switchMap,
  tap,
} from "rxjs";

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
      text: "Create Monitor",
      path: "/monitors",
    },
    refresh: true,
    links: [{ text: "View All Monitors", path: "/monitors" }],
  };

  filters = {
    dateFilter: {},
    searchField: {
      text: "Type to filter...",
      props: [
        "owner",
        { prop: "breaching_channels", props: ["channel"] },
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
            transform: (monitor) => {
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
          prop: "breaching_channels",
          sortable: false,
          width: 50,
          cellTemplate: this.channelsTemplate,
        },
      ];
    }, 0);
  }

  fetchData() {
    const lastDay = this.dateService.subtractFromNow(1, "day").format();
    return this.loadingService.doLoading(
      forkJoin({
        alerts: this.alertService.getAlerts({ starttime: lastDay }),
        monitors: this.monitorService.getMonitors(),
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
    this.fetchData().subscribe();
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
