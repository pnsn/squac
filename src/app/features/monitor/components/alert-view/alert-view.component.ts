import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DateService } from "@core/services/date.service";
import { Alert } from "@features/monitor/models/alert";
import { Monitor } from "@features/monitor/models/monitor";
import { AlertsService } from "@features/monitor/services/alerts.service";
import { MonitorsService } from "@features/monitor/services/monitors.service";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { mergeMap, Subscription, tap } from "rxjs";

@Component({
  selector: "monitor-alert-view",
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
  refreshInProgress = false;
  subscription = new Subscription();
  @ViewChild("stateTemplate") public stateTemplate: TemplateRef<any>;
  constructor(
    private alertsService: AlertsService,
    private route: ActivatedRoute,
    private monitorsService: MonitorsService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {
    this.route.parent.data.subscribe((data) => {
      if (data.monitors.error || data.alerts.error) {
        this.error = true;
      } else {
        this.error = false;
        this.monitors = data.monitors;
        this.findMonitorForAlerts(data.alerts);
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
            this.findMonitorForAlerts(alerts);
            this.refreshInProgress = false;
          })
        )
        .subscribe();

      this.subscription.add(refreshRequests);
    }
  }

  // match alerts and monitors
  findMonitorForAlerts(alerts: Alert[]) {
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

//name, prop, minWidth, maxWidth, flexGrow, width, resizeable, comparator, sortable,
//draggable, canAutoResize, cellTemplate: TemplateRef, checkboxable, headercheckboxable,
//headerClass, cellCass, frozenLeft, frozenRight,
//pipe

//   columns = [];
//   options = {
//     columnMode: ColumnMode.force,
//     headerHeight: "30",
//     footerHeight: "50",
//     rowHeight: "auto",
//     messages: {
//       emptyMessage: "No alerts found.",
//       totalMessage: "alerts",
//     },
//   };
// // this.columns = [
//   {
//     name: "State",
//     prop: "inAlarm",
//     width: "60",
//     minWidth: "60",
//     resizeable: false,
//     sortable: false,
//     canAutoResize: false,
//     templateRef: this.stateTemplate,
//   },
//   {
//     name: "Time",
//     prop: "timestamp",
//     width: "30",
//     draggable: "false",
//   },
//   {
//     name: "Monitor",
//     prop: "monitor",
//     draggable: false,
//     width: "150",
//   },
//   {
//     name: "Trigger",
//     prop: "trigger",
//     draggable: false,
//   },
//   {
//     name: "Breaching channels",
//     prop: "breaching_channels",
//     draggable: false,
//   },
// ];
