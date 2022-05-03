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
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { mergeMap, Subscription, tap } from "rxjs";

@Component({
  selector: "monitor-alert-view",
  templateUrl: "./alert-view.component.html",
  styleUrls: ["./alert-view.component.scss"],
})
export class AlertViewComponent implements OnInit, OnDestroy, AfterViewInit {
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
  @ViewChild("triggerTemplate") public triggerTemplate: TemplateRef<any>;
  @ViewChild("updateTemplate") public updateTemplate: TemplateRef<any>;
  @ViewChild("channelsTemplate") public channelsTemplate: TemplateRef<any>;
  constructor(
    private alertService: AlertService,
    private route: ActivatedRoute,
    private monitorService: MonitorService,
    private dateService: DateService
  ) {}

  rows;
  columns;

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

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
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

  refresh() {
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
    this.rows = [...this.alerts];
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
