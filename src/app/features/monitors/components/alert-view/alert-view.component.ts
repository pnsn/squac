import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DateService } from "@core/services/date.service";
import { Alert } from "@features/monitors/models/alert";
import { Monitor } from "@features/monitors/models/monitor";
import { AlertsService } from "@features/monitors/services/alerts.service";
import { MonitorsService } from "@features/monitors/services/monitors.service";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { mergeMap, Subscription, tap } from "rxjs";

@Component({
  selector: "app-alert-view",
  templateUrl: "./alert-view.component.html",
  styleUrls: ["./alert-view.component.scss"],
})
export class AlertViewComponent implements OnInit, OnDestroy {
  alerts: Alert[];
  interval;
  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  error: boolean;
  monitors: Monitor[];
  refreshInProgress: boolean = false;
  subscription = new Subscription();
  constructor(
    private alertsService: AlertsService,
    private route: ActivatedRoute,
    private monitorsService: MonitorsService,
    private dateService: DateService
  ) {}
  messages = {
    emptyMessage: "No alerts found.",
    totalMessage: "alerts",
  };

  ngOnInit(): void {
    this.route.parent.data.subscribe((data) => {
      if (data.monitors.error || data.alerts.error) {
        this.error = true;
      } else {
        this.error = false;
        this.monitors = data.monitors;
        this.findMonitorsForAlerts(data.alerts);
      }
    });
  }

  refresh() {
    if (!this.refreshInProgress) {
      this.refreshInProgress = true;
      const lastHour = this.dateService.subtractFromNow(1, "day").format();
      const refreshRequests = this.monitorsService
        .getMonitors()
        .pipe(
          tap((monitors) => {
            this.monitors = monitors;
          }),
          mergeMap(() => {
            return this.alertsService.getAlerts({ starttime: lastHour });
          }),
          tap((alerts) => {
            this.findMonitorsForAlerts(alerts);
            this.refreshInProgress = false;
          })
        )
        .subscribe();

      this.subscription.add(refreshRequests);
    }
  }

  // match alerts and monitors
  findMonitorsForAlerts(alerts: Alert[]) {
    this.alerts = [];
    if (this.monitors.length > 0 && alerts.length > 0) {
      this.alerts = alerts.map((alert) => {
        alert.monitor = this.monitors.find(
          (m) => m.id === alert.trigger.monitorId
        );
        return alert;
      });
    }
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
    clearInterval(this.interval);
  }
}
