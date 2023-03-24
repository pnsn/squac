import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import { MessageService } from "@core/services/message.service";
import { DATE_PICKER_TIMERANGES } from "@dashboard/components/dashboard-detail/dashboard-time-ranges";
import { PageOptions } from "@shared/components/detail-page/detail-page.interface";
import {
  TableControls,
  TableOptions,
} from "@shared/components/table-view/interfaces";
import { connect } from "echarts";
import { forkJoin, Observable, Subscription, switchMap, tap } from "rxjs";
import {
  Alert,
  AlertService,
  BreachingChannel,
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

enum LoadingIndicator {
  RESULTS,
  MAIN,
}
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
  widget: Widget = new Widget({
    name: "Monitor",
    stat: "latest",
    dashboard: 1,
    metrics: [],
    properties: {},
    type: WidgetType.TIMESERIES,
  });
  selectedAlert: Alert;
  timeRange: number = 1 * 24 * 60 * 60;
  channelGroup: ChannelGroup;
  // time picker config
  datePickerTimeRanges = DATE_PICKER_TIMERANGES;
  starttime: string;
  endtime: string;
  subscriptions = new Subscription();
  unsavedChanges = false;
  LoadingIndicator = LoadingIndicator;
  /** Config for detail page */
  pageOptions: PageOptions = {
    titleButtons: {
      deleteButton: true,
      addButton: true,
      editButton: true,
    },
    path: "/monitors",
  };
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
    private changeDetector: ChangeDetectorRef,
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
          transform: (row: BreachingChannel): number => {
            return row[this.monitor.stat];
          },
        },
        comparator: (a: BreachingChannel, b: BreachingChannel): number => {
          return a[this.monitor.stat] - b[this.monitor.stat];
        },
      },
    ];

    const chanSub = this.route.params
      .pipe(
        tap(() => {
          this.error = false;
        }),
        switchMap(() => {
          const data = this.route.snapshot.data;
          this.monitor = data["monitor"];
          return this.loadingService.doLoading(
            forkJoin({
              channelGroup: this.channelGroupService.read(
                this.monitor.channelGroupId
              ),
              metric: this.metricService.read(this.monitor.metricId),
            }),
            this,
            LoadingIndicator.MAIN
          );
        })
      )
      .subscribe({
        next: (results) => {
          this.widget.metrics = [results.metric];
          this.widgetManager.initWidget(this.widget);

          this.starttime = this.dateService.format(
            this.dateService.subtractFromNow(this.timeRange, "seconds")
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
    this.loadingService
      .doLoading(this.getAlerts(), this, LoadingIndicator.RESULTS)
      .subscribe({
        next: (alerts: Alert[]) => {
          this.unsavedChanges = false;
          this.alerts = alerts;
          this.changeDetector.detectChanges();
          this.channelChart?.updateData();
          this.monitorChart?.updateData();

          setTimeout(() => {
            if (this.channelChart && this.monitorChart) {
              const channelChart = this.channelChart.echartsInstance;
              const monitorChart = this.monitorChart.echartsInstance;
              if (monitorChart && channelChart) {
                connect([channelChart, monitorChart]);
              }
            }
          }, 0);
        },
      });
  }

  /**
   * Delete monitor
   */
  delete(): void {
    this.monitorService.delete(this.monitor.id).subscribe({
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
    this.widgetManager.updateTimes(startDate, endDate);
    this.unsavedChanges = true;
  }
}
