import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { DateService } from "@core/services/date.service";
import { Alert } from "@features/monitors/models/alert";
import { Monitor } from "@features/monitors/models/monitor";
import { Trigger } from "@features/monitors/models/trigger";
import { AlertsService } from "@features/monitors/services/alerts.service";
import { MonitorsService } from "@features/monitors/services/monitors.service";
import { TriggersService } from "@features/monitors/services/triggers.service";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { tap, map, switchMap, mergeMap, filter, Subscription } from "rxjs";

@Component({
  selector: "app-monitor-view",
  templateUrl: "./monitor-view.component.html",
  styleUrls: ["./monitor-view.component.scss"],
})
export class MonitorViewComponent implements OnInit {
  monitors: Monitor[];
  selected: Monitor[];
  rows = [];
  @ViewChild("monitorTable") table: any;
  subscription = new Subscription();
  selectedMonitorId: number;
  error: boolean;
  alerts: Alert[] = [];
  refreshInProgress: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertsService: AlertsService,
    private monitorsService: MonitorsService,
    private confirmDialog: ConfirmDialogService,
    private dateService: DateService
  ) {}

  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  messages = {
    emptyMessage: "No monitors found.",
    totalMessage: "monitors",
  };
  ngOnInit(): void {
    this.selected = [];
    this.route.parent.data.subscribe((data) => {
      if (data.monitors.error || data.alerts.error) {
        this.error = true;
      } else {
        this.error = false;
        this.monitors = data.monitors;
        this.alerts = data.alerts;
      }
    });

    if (this.route.firstChild) {
      this.selectedMonitorId = +this.route.firstChild.snapshot.params.monitorId;
      this.selectMonitor(this.selectedMonitorId);
    }
    const routerEvents = this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        tap((e: NavigationEnd) => {
          if (e.urlAfterRedirects.toString() === "/monitors") {
            this.refresh();
          }
        })
      )
      .subscribe();

    this.makeRows();
    this.subscription.add(routerEvents);
  }

  makeRows() {
    this.monitors.forEach((monitor) => {
      monitor.alerts = this.getAlerts(monitor.id);
      monitor.inAlarm = false;
      monitor.triggers.forEach((trigger) => {
        trigger.lastAlarm = monitor.alerts.find(
          (a) => a.trigger.id === trigger.id
        );
        if (trigger.lastAlarm && trigger.lastAlarm.inAlarm) {
          monitor.inAlarm = true;
        }
        trigger.monitor = monitor;
        this.rows.push(trigger);
      });
    });
    this.rows = [...this.rows];
    console.log("make rows");
  }

  refresh() {
    if (!this.refreshInProgress) {
      this.refreshInProgress = true;
      const lastHour = this.dateService.subtractFromNow(1, "hour").format();
      const refreshRequests = this.alertsService
        .getAlerts({ starttime: lastHour })
        .pipe(
          tap((alerts) => {
            this.alerts = alerts;
          }),
          mergeMap(() => {
            return this.monitorsService.getMonitors();
          }),
          tap((monitors) => {
            this.monitors = monitors;
            this.makeRows();
            this.refreshInProgress = false;
          })
        )
        .subscribe();

      this.subscription.add(refreshRequests);
    }
  }

  getAlerts(id: number) {
    return this.alerts.filter((a) => a.trigger.monitorId === id);
  }

  addMonitor() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  editMonitor(id: number) {
    this.router.navigate([id, "edit"], { relativeTo: this.route });
  }

  getMonitor(id: number) {
    return this.monitors.filter((a) => a.id === id);
  }

  // Getting a selected channel group and setting variables
  selectMonitor(selectedMonitorId: number) {
    this.selected = this.monitors.filter((cg) => {
      // Select row with channel group
      return cg.id === selectedMonitorId;
    });
  }

  toggleExpandGroup(group) {
    console.log("toggle");
    this.table.groupHeader.toggleExpandGroup(group);
    return false;
  }

  rowIdentity(row) {
    return row.id;
  }

  onDelete(monitor) {
    this.confirmDialog.open({
      title: `Delete ${monitor.name}`,
      message: "Are you sure? This action is permanent.",
      cancelText: "Cancel",
      confirmText: "Delete",
    });
    this.confirmDialog.confirmed().subscribe((confirm) => {
      if (confirm) {
        this.deleteMonitor(monitor.id);
      }
    });
  }

  deleteMonitor(id) {
    this.monitorsService
      .deleteMonitor(id)
      .pipe(
        tap(() => {
          this.refresh();
        })
      )
      .subscribe();
  }

  viewMonitor(id) {
    if (id) {
      this.router.navigate([id], { relativeTo: this.route });
      this.selectedMonitorId = id;
      this.selectMonitor(id);
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }
}
