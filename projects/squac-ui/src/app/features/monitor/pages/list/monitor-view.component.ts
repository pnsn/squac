import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router, RouterOutlet } from "@angular/router";
import { LoadingService } from "@core/services/loading.service";
import { Alert } from "squacapi";
import { Monitor } from "squacapi";
import { MonitorService } from "squacapi";
import { catchError, EMPTY, Observable, Subscription, tap } from "rxjs";
import {
  MenuAction,
  TableControls,
  TableFilters,
  TableOptions,
} from "@shared/components/table-view/interfaces";
import { PageOptions } from "@shared/components/detail-page/detail-page.interface";
import { DetailPageComponent } from "@shared/components/detail-page/detail-page.component";
import { TableViewComponent } from "@shared/components/table-view/table-view.component";
import { AsyncPipe, NgIf } from "@angular/common";
import { MonitorAlarmStatusComponent } from "@monitor/components/monitor-alarm-status/monitor-alarm-status.component";

/**
 * Component for displaying list of monitors
 */
@Component({
  selector: "monitor-view",
  templateUrl: "./monitor-view.component.html",
  styleUrls: ["./monitor-view.component.scss"],
  standalone: true,
  imports: [
    DetailPageComponent,
    TableViewComponent,
    AsyncPipe,
    MonitorAlarmStatusComponent,
    RouterOutlet,
    NgIf,
  ],
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
  columns;

  /** Config for detail page */
  pageOptions: PageOptions = {
    path: "/monitors",
    titleButtons: {
      addButton: true,
      useText: true,
    },
  };

  controls: TableControls = {
    listenToRouter: true,
    basePath: "/monitors",
    resource: "Monitor",
    add: {
      text: "Add Monitor",
    },
    menu: {
      text: "Actions",
      options: [
        {
          text: "View",
          permission: "read",
          action: "view",
        },
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

  filters: TableFilters = {
    searchField: {
      text: "Filter monitors...",
      props: ["owner", "name", "channelGroupName", "metricName"],
    },
  };

  options: TableOptions = {
    messages: {
      emptyMessage: "No monitors found.",
    },
    footerLabel: "Monitors",
    defaultSort: "lastUpdate",
    defaultSortDir: "desc",
  };

  // table templates
  @ViewChild("stateTemplate") stateTemplate: any;
  @ViewChild("updateTemplate") updateTemplate: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private monitorService: MonitorService,
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {}

  /** Init subscriptions */
  ngOnInit(): void {
    const routeSub = this.route.data
      .pipe(
        tap((data) => {
          this.monitors = data["monitors"];
        })
      )
      .subscribe({
        next: () => {
          this.makeRows();
        },
      });

    this.subscription.add(routeSub);
  }

  /** Set up columns */
  ngAfterViewInit(): void {
    this.columns = [
      {
        name: "State",
        columnDef: "inAlarm",
        cellTemplate: this.stateTemplate,
      },
      {
        name: "Name",
        columnDef: "name",
      },
      {
        name: "Last State Change",
        columnDef: "lastUpdate",
        cellTemplate: this.updateTemplate,
      },
      {
        name: "Channel Group",
        columnDef: "channelGroupName",
      },
      {
        name: "Metric",
        columnDef: "metricName",
      },
      {
        name: "Owner",
        columnDef: "owner",
      },
    ];
    this.cdr.detectChanges();
  }

  /**
   * Click event from table
   *
   * @param event click action
   */
  onClick(event: MenuAction): void {
    if (event === "delete" && this.selectedMonitorId) {
      this.onDelete();
    }
  }

  /** Delete selected monitor */
  onDelete(): void {
    this.monitorService.delete(this.selectedMonitorId).subscribe(() => {
      const index = this.monitors.findIndex(
        (m) => m.id === this.selectedMonitorId
      );

      this.monitors.splice(index, 1);
    });
  }

  /** Populate rows in table */
  makeRows(): void {
    this.rows = [...this.monitors];
  }

  /**
   * select event from table
   *
   * @param monitor selected monitor
   */
  onSelect(monitor?: Monitor): void {
    this.selectedMonitorId = monitor ? monitor.id : null;
  }

  /**
   * Fetch new monitors
   *
   * @param refresh true if cache should not be used
   * @returns obsercable of monitors and alerts
   */
  fetchData(refresh?: boolean): Observable<any> {
    return this.monitorService.list({}, refresh).pipe(
      tap((monitors) => {
        this.monitors = monitors;
        this.makeRows();
      }),
      catchError(() => {
        return EMPTY;
      })
    );
  }

  /**
   * Get fresh monitors
   */
  refresh(): void {
    this.loadingService.doLoading(this.fetchData(true), this).subscribe();
  }

  /**
   * Get all alerts with given monitor id
   *
   * @param monitorId id to match
   * @returns array of matching alerts
   */
  getAlerts(monitorId: number): Alert[] {
    return this.alerts.filter((a) => a.monitorId === monitorId);
  }

  /**
   * Navigates to edit monitor page
   *
   * @param id monitor edit id
   */
  editMonitor(id: number): void {
    this.router.navigate([id, "edit"], { relativeTo: this.route });
  }

  /**
   * Navigates to monitor detail page
   *
   * @param id monitor id
   */
  viewMonitor(id?: number): void {
    if (id) {
      this.router.navigate([id], { relativeTo: this.route });
      this.selectedMonitorId = id;
    }
  }

  /** unsubscribes */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
