import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import { MessageService } from "@core/services/message.service";
import { DATE_PICKER_TIMERANGES } from "@dashboard/components/dashboard-detail/dashboard-time-ranges";
import {
  TableControls,
  TableOptions,
} from "@shared/components/table-view/interfaces";
import { forkJoin, Observable, Subscription, switchMap, tap } from "rxjs";
import {
  Alert,
  AlertService,
  Channel,
  ChannelGroup,
  ChannelGroupService,
  MetricService,
  Monitor,
  MonitorService,
  Widget,
} from "squacapi";
import {
  WidgetConfigService,
  WidgetDataService,
  WidgetManagerService,
  WidgetType,
} from "widgets";

/**
 * Component for viewing single monitor
 */
@Component({
  selector: "monitor-detail",
  templateUrl: "./monitor-detail.component.html",
  styleUrls: ["./monitor-detail.component.scss"],
  providers: [WidgetConfigService, WidgetManagerService, WidgetDataService],
})
export class MonitorDetailComponent implements OnInit {
  @ViewChild("monitorChart") monitorChart;
  @ViewChild("channelChart") channelChart;
  error: boolean;
  alerts: Alert[];
  monitor: Monitor;
  widget: Widget;
  selectedAlert: Alert;
  timeRange: number;
  channelGroup: ChannelGroup;
  // time picker config
  datePickerTimeRanges = DATE_PICKER_TIMERANGES;
  starttime: string;
  endtime: string;
  subscriptions = new Subscription();
  unsavedChanges = false;

  controls: TableControls = {
    listenToRouter: true,
    resource: "Monitor",
    add: {
      text: "Add Monitor",
      path: "/monitors",
    },
    links: [{ text: "View All Monitors", path: "/monitors" }],
  };

  options: TableOptions = {
    messages: {
      emptyMessage: "No alerts found.",
    },
    footerLabel: "Alerts",
  };
  columns = [];
  viewTriggers = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private monitorService: MonitorService,
    public loadingService: LoadingService,
    private dateService: DateService,
    private widgetManager: WidgetManagerService,
    private channelGroupService: ChannelGroupService,
    private metricService: MetricService,
    private widgetDataService: WidgetDataService,
    private widgetConfigService: WidgetConfigService,
    private changeDetector: ChangeDetectorRef,
    private confirmDialog: ConfirmDialogService,
    private messageService: MessageService
  ) {}
  // last n intervals
  /**
   * subscribes to route params
   */
  ngOnInit(): void {
    this.columns = [
      { name: "Channel", prop: "channel" },
      {
        name: "Value",
        prop: "",
        pipe: {
          transform: (row) => {
            return row[this.monitor.stat];
          },
        },
        comparator: (a, b) => {
          return a[this.monitor.stat] - b[this.monitor.stat];
        },
      },
    ];

    const chanSub = this.route.data
      .pipe(
        tap(() => {
          this.error = false;
        }),
        switchMap((data) => {
          this.monitor = data["monitor"];
          return this.loadingService.doLoading(
            forkJoin({
              channelGroup: this.channelGroupService.read(
                this.monitor.channelGroupId
              ),
              metric: this.metricService.read(this.monitor.metricId),
            }),
            this
          );
        })
      )
      .subscribe({
        next: (results) => {
          this.widget = new Widget({
            name: "Monitor",
            stat: "latest",
            dashboard: 1,
            metrics: [],
          });
          this.widget.metrics = [results.metric];
          this.widget.properties = {};
          this.widget.type = WidgetType.TIMESERIES;
          this.widgetManager.initWidget(this.widget);
          this.widgetManager.widgetConfig;
          this.starttime = this.dateService.format(
            this.dateService.subtractFromNow(2, "day")
          );
          this.endtime = this.dateService.format(this.dateService.now());

          this.widgetManager.updateTimes(this.starttime, this.endtime);
          this.widgetManager.updateMetrics(this.widget.metrics);
          this.channelGroup = results.channelGroup;
          this.widgetManager.updateChannels(
            this.monitor.channelGroupId,
            results.channelGroup.channels as Channel[]
          );

          this.widgetManager.updateWidgetType(WidgetType.TIMESERIES);
          this.update();
        },
      });
    this.subscriptions.add(chanSub);
  }

  /**
   * Requests alerts iwthin time range
   *
   * @returns alerts
   */
  getAlerts(): Observable<Alert[]> {
    return this.alertService.list({
      timestampGte: this.widgetManager.starttime,
      timestampLt: this.widgetManager.endtime,
      monitor: this.monitor.id,
    });
  }

  /**
   * Requests new data
   */
  update(): void {
    this.getAlerts().subscribe({
      next: (alerts: Alert[]) => {
        this.unsavedChanges = false;
        this.alerts = alerts;
        this.changeDetector.detectChanges();
        this.channelChart?.updateData();
        this.monitorChart?.updateData();
      },
    });
  }

  /**
   * Delete monitor after confirmation
   */
  onDelete(): void {
    this.confirmDialog.open({
      title: `Delete ${this.monitor.name}`,
      message: "Are you sure? This action is permanent.",
      cancelText: "Cancel",
      confirmText: "Delete",
    });
    this.confirmDialog.confirmed().subscribe((confirm) => {
      if (confirm) {
        this.delete();
      }
    });
  }

  /**
   * Delete monitor
   */
  delete(): void {
    this.channelGroupService.delete(this.monitor.id).subscribe({
      next: () => {
        this.closeMonitor();
        this.messageService.message("Monitor deleted.");
      },
      error: () => {
        this.messageService.error("Could not delete monitor");
      },
    });
  }

  /**
   * Navigate to edit path
   */
  editMonitor(): void {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  /**
   * Add new monitor
   */
  addNewMonitor(): void {
    this.router.navigate(["/", "monitors", "new"], {
      relativeTo: this.route,
    });
  }

  /**
   * Close container and route to parent
   */
  closeMonitor(): void {
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  /**
   * Dates emitted when user changes time ranges, updates
   * dates in widget manager
   *
   * @param root0 emitted dates
   * @param root0.startDate time range start date
   * @param root0.endDate end of time range
   * @param root0._liveMode is time range live
   * @param root0.rangeInSeconds width of time range
   */
  datesChanged({ startDate, endDate, _liveMode, rangeInSeconds }): void {
    if (!startDate || !endDate) {
      startDate = this.dateService.subtractFromNow(rangeInSeconds, "seconds");
      endDate = this.dateService.now();
    }
    this.widgetManager.updateTimes(
      this.dateService.format(startDate),
      this.dateService.format(endDate)
    );
    this.unsavedChanges = true;
  }
}