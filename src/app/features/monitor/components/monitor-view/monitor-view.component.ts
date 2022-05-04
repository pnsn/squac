import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { DateService } from "@core/services/date.service";
import { Alert } from "@monitor/models/alert";
import { Monitor } from "@monitor/models/monitor";
import { AlertService } from "@monitor/services/alert.service";
import { MonitorService } from "@monitor/services/monitor.service";
import { tap, mergeMap, filter, Subscription } from "rxjs";

@Component({
  selector: "monitor-view",
  templateUrl: "./monitor-view.component.html",
  styleUrls: ["./monitor-view.component.scss"],
})
export class MonitorViewComponent implements OnInit, OnDestroy, AfterViewInit {
  monitors: Monitor[] = [];
  @ViewChild("monitorTable") table: any;
  @ViewChild("stateTemplate") stateTemplate: any;
  @ViewChild("updateTemplate") updateTemplate: any;
  @ViewChild("conditionsTemplate") conditionsTemplate: any;
  @ViewChild("notificationTemplate") notificationTemplate: any;
  @ViewChild("emailListTemplate") emailListTemplate: any;
  @ViewChild("channelsTemplate") channelsTemplate: any;
  @ViewChild("groupHeaderTemplate") groupHeaderTemplate: any;
  @ViewChild("groupHeaderTemplate") rowDetailTemplate: any;
  subscription = new Subscription();
  selectedMonitorId: number;
  error: boolean;
  alerts: Alert[] = [];
  refreshInProgress = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private monitorService: MonitorService,
    private confirmDialog: ConfirmDialogService,
    private dateService: DateService
  ) {}

  rows;
  columns;

  controls = {
    listenToRouter: true,
    resource: "Monitor",
    add: {
      text: "Create Monitor",
    },
    menu: {
      text: "Actions",
      options: [
        {
          text: "Edit",
          permission: "update",
          action: "edit",
        },
        {
          text: "Delete",
          permission: "delete",
          action: "delete",
        },
      ],
    },
    refresh: true,
    links: [{ text: "View All Alerts", path: "alerts" }],
  };

  filters = {
    // toggleShared: {
    //   default: "user",
    // },
    searchField: {
      text: "Type to filter...",
      props: [
        "owner",

        {
          prop: "monitor",
          props: [
            { prop: "channelGroup", props: ["name"] },
            { prop: "metric", props: ["name"] },
            "stat",
            "name",
          ],
        },
      ],
    },
  };

  options = {
    groupRowsBy: "monitorId",
    groupParentType: "monitor",
    groupExpansionDefault: true,
    messages: {
      emptyMessage: "No monitors found.",
    },
    footerLabel: "Monitors",
  };

  ngOnInit(): void {
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
      // this.selectMonitor(this.selectedMonitorId);
    }

    this.makeRows();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        {
          name: "State",
          draggable: false,
          sortable: false,
          width: 60,
          minWidth: 60,
          canAutoResize: false,
          cellTemplate: this.stateTemplate,
        },
        {
          name: "Last state update",
          draggable: false,
          canAutoResize: false,
          sortable: false,
          width: 160,
          minWidth: 160,
          cellTemplate: this.updateTemplate,
        },
        {
          name: "# channels",
          canAutoResize: false,
          sortable: false,
          width: 100,
          cellTemplate: this.channelsTemplate,
        },
        {
          name: "'In Alarm' conditions",
          sortable: false,
          width: 200,
          cellTemplate: this.conditionsTemplate,
        },
        {
          name: "Actions",
          draggable: false,
          sortable: false,
          width: 50,
          cellTemplate: this.notificationTemplate,
        },
        {
          name: "Recipients",
          sortable: false,
          width: 200,
          cellTemplate: this.emailListTemplate,
        },
      ];
    }, 0);
  }

  makeRows() {
    const temp = [];
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
        // add copy to avoid monitor having triggers that have monitor
        const monitorCopy = Object.assign({}, monitor);
        monitorCopy.triggers = [];
        trigger.monitor = monitorCopy;
        temp.push(trigger);
      });
    });
    this.rows = [...temp];
  }

  onSelect($event) {
    console.log($event);
  }

  refresh() {
    if (!this.refreshInProgress) {
      this.refreshInProgress = true;
      const lastDay = this.dateService.subtractFromNow(1, "day").format();
      const refreshRequests = this.alertService
        .getAlerts({ starttime: lastDay })
        .pipe(
          tap((alerts) => {
            this.alerts = alerts;
          }),
          mergeMap(() => {
            return this.monitorService.getMonitors();
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
    return this.monitors.find((a) => a.id === id);
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
    this.monitorService
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
      // this.selectMonitor(id);
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }
}
