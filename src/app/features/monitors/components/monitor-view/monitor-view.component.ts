import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { DateService } from "@core/services/date.service";
import { Alert } from "@features/monitors/models/alert";
import { Monitor } from "@features/monitors/models/monitor";
import { Trigger } from "@features/monitors/models/trigger";
import { AlertsService } from "@features/monitors/services/alerts.service";
import { MonitorsService } from "@features/monitors/services/monitors.service";
import { TriggersService } from "@features/monitors/services/triggers.service";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { tap, map } from "rxjs";

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

  selectedMonitorId: number;
  error: boolean;
  alerts: Alert[] = [];
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

    this.makeRows();
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
  }

  refresh() {
    const lastHour = this.dateService.subtractFromNow(1, "hour").format();
    this.alertsService
      .getAlerts({ starttime: lastHour })
      .subscribe((alerts) => {
        this.alerts = alerts;
      });
    this.monitorsService.getMonitors().subscribe((monitors) => {
      this.monitors = monitors;
    });
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
    this.table.groupHeader.toggleExpandGroup(group);
    return false;
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
    this.monitorsService.deleteMonitor(id).subscribe();
  }

  viewMonitor(id) {
    if (id) {
      this.router.navigate([id], { relativeTo: this.route });
      this.selectedMonitorId = id;
      this.selectMonitor(id);
    }
  }
}
