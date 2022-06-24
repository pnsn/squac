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
import { Alert } from "@monitor/models/alert";
import { Monitor } from "@monitor/models/monitor";
import { AlertService } from "@monitor/services/alert.service";
import { MonitorService } from "@monitor/services/monitor.service";
import { mergeMap, Subscription, tap } from "rxjs";

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
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      if (data.monitors.error || data.alerts.error) {
        this.error = true;
      } else {
        this.error = false;
        this.monitors = data.monitors;
        this.findMonitorForAlerts(data.alerts);
      }
    });
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

  // get fresh data
  refresh(): void {
    if (!this.refreshInProgress) {
      this.refreshInProgress = true;
      const lastHour = this.dateService.subtractFromNow(1, "day").format();
      const refreshRequests = this.monitorService
        .getMonitors()
        .pipe(
          tap((monitors) => {
            this.monitors = monitors;
          }),
          mergeMap(() => {
            return this.alertService.getAlerts({ starttime: lastHour });
          }),
          tap((alerts) => {
            this.findMonitorForAlerts(alerts);
            this.refreshInProgress = false;
          })
        )
        .subscribe();

      this.subscription.add(refreshRequests);
    }
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
