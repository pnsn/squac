import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import { Alert } from "@monitor/models/alert";
import { Monitor } from "@monitor/models/monitor";
import { AlertService } from "@monitor/services/alert.service";
import { MonitorService } from "@monitor/services/monitor.service";
import {
  tap,
  Subscription,
  catchError,
  EMPTY,
  forkJoin,
  switchMap,
} from "rxjs";

@Component({
  selector: "monitor-view",
  templateUrl: "./monitor-view.component.html",
  styleUrls: ["./monitor-view.component.scss"],
})
export class MonitorViewComponent implements OnInit, OnDestroy, AfterViewInit {
  subscription = new Subscription();
  monitors: Monitor[] = [];
  selectedMonitorId: number;
  error: boolean;
  alerts: Alert[] = [];
  refreshInProgress = false;

  // table config
  rows = [];
  columns = [];

  controls = {
    listenToRouter: true,
    basePath: "/monitors",
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

  // table templates
  @ViewChild("monitorTable") table: any;
  @ViewChild("stateTemplate") stateTemplate: any;
  @ViewChild("updateTemplate") updateTemplate: any;
  @ViewChild("conditionsTemplate") conditionsTemplate: any;
  @ViewChild("notificationTemplate") notificationTemplate: any;
  @ViewChild("emailListTemplate") emailListTemplate: any;
  @ViewChild("channelsTemplate") channelsTemplate: any;
  @ViewChild("groupHeaderTemplate") groupHeaderTemplate: any;
  @ViewChild("groupHeaderTemplate") rowDetailTemplate: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private monitorService: MonitorService,
    private dateService: DateService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    const monitorsSub = this.route.params
      .pipe(
        switchMap((params) => {
          return this.loadingService.doLoading(this.fetchData());
        })
      )
      .subscribe();

    this.subscription.add(monitorsSub);

    if (this.route.firstChild) {
      this.selectedMonitorId = +this.route.firstChild.snapshot.params.monitorId;
    }
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

  // click event from table
  onClick(event): void {
    if (event === "delete" && this.selectedMonitorId) {
      this.onDelete();
    }
  }

  // delete selected monitor
  onDelete(): void {
    this.monitorService.deleteMonitor(this.selectedMonitorId).subscribe(() => {
      const index = this.monitors.findIndex(
        (m) => m.id === this.selectedMonitorId
      );

      this.monitors.splice(index, 1);
    });
  }

  //populate rows for table
  makeRows(): void {
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

  // select event from table
  onSelect(monitor): void {
    this.selectedMonitorId = monitor ? monitor.id : null;
  }

  fetchData() {
    const lastDay = this.dateService.subtractFromNow(1, "day").format();
    return forkJoin({
      alerts: this.alertService.getAlerts({ starttime: lastDay }),
      monitors: this.monitorService.getMonitors(),
    }).pipe(
      tap((results) => {
        this.monitors = results.monitors;
        this.alerts = results.alerts;
        this.makeRows();
      }),
      catchError(() => {
        return EMPTY;
      })
    );
  }
  // get fresh alerts
  refresh() {
    this.loadingService.doLoading(this.fetchData(), this).subscribe();
  }

  // return alerts with monitorId
  getAlerts(monitorId: number): Alert[] {
    return this.alerts.filter((a) => a.trigger.monitorId === monitorId);
  }

  // route to edit monitor page
  editMonitor(id: number): void {
    this.router.navigate([id, "edit"], { relativeTo: this.route });
  }

  // route to monitor page
  viewMonitor(id): void {
    if (id) {
      this.router.navigate([id], { relativeTo: this.route });
      this.selectedMonitorId = id;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
