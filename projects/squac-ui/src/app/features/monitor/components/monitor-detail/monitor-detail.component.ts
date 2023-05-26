import { SelectionChange, SelectionModel } from "@angular/cdk/collections";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { ColumnMode, SelectionType } from "@boring.devs/ngx-datatable";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import { MessageService } from "@core/services/message.service";
import { nestedPropertyDataAccessor } from "@core/utils/utils";
import { DATE_PICKER_TIMERANGES } from "@dashboard/components/dashboard-detail/dashboard-time-ranges";
import { PageOptions } from "@shared/components/detail-page/detail-page.interface";
import {
  TableControls,
  TableOptions,
} from "@shared/components/table-view/interfaces";
import { connect } from "echarts";
import { forkJoin, map, Observable, Subscription, switchMap, tap } from "rxjs";
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
  Trigger,
  Widget,
} from "squacapi";
import {
  WidgetConfigService,
  WidgetDataService,
  WidgetManagerService,
  WidgetType,
} from "widgets";

/** loading indicator areas */
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
export class MonitorDetailComponent implements OnInit, AfterViewInit {
  /** monitor chart instance */
  @ViewChild("monitorChart") monitorChart;
  /** channel chart instance */
  @ViewChild("channelChart") channelChart;
  @ViewChild(MatSort) sort: MatSort;
  /** ngxdatatable column config */
  ColumnMode = ColumnMode;
  /** ngxdatatable selection config */
  SelectionType = SelectionType;
  /** true if page has an error */
  error: boolean;
  /** alerts for monitor */
  alerts: Alert[];
  /** monitor to display on page */
  monitor: Monitor;
  /** widget created for chart config */
  widget: Widget = new Widget({
    name: "Monitor",
    stat: "latest",
    dashboard: 1,
    metrics: [],
    properties: {},
    type: WidgetType.TIMESERIES,
  });
  /** currently selected alert */
  selectedAlert: Alert;
  /** default time range for data requests */
  timeRange: number = 1 * 24 * 60 * 60;
  /** monitor's channel group */
  channelGroup: ChannelGroup;
  /** time picker config */
  datePickerTimeRanges = DATE_PICKER_TIMERANGES;
  /** start time for data */
  starttime: string;
  /** endtime for data */
  endtime: string;
  /** rxjs subscriptions */
  subscriptions = new Subscription();
  /** true if dates have been changed */
  unsavedChanges = false;
  /** loading indicator config */
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
  /** controls for table config */
  controls: TableControls = {
    listenToRouter: true,
    resource: "Monitor",
    add: {
      text: "Add Monitor",
      path: "/monitors",
    },
    links: [{ text: "View All Monitors", path: "/monitors" }],
  };

  /** table options config */
  options: TableOptions = {
    messages: {
      emptyMessage: "No alerts found.",
    },
    footerLabel: "Alerts",
  };
  /** table columns */
  columns = [];
  /** true if trigger section should be shown */
  viewTriggers = true;

  alertColumns: string[] = [
    "select",
    "inAlarm",
    "timestamp",
    "triggerId",
    "breachingChannels.length",
  ];

  alertDataSource: MatTableDataSource<Alert> = new MatTableDataSource([]);

  alertSelection = new SelectionModel<Alert>(false, []);

  triggerColumns: string[] = [
    "fullString",
    "inAlarm",
    "lastUpdate",
    "alertOnOutOfAlarm",
    "emails",
  ];

  triggerDataSource: MatTableDataSource<Trigger> = new MatTableDataSource([]);

  breachingChannelColumns: string[] = [];
  breachingChannelsDataSource: MatTableDataSource<BreachingChannel> =
    new MatTableDataSource([]);

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

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.alertDataSource.sort = this.sort;
    this.triggerDataSource.sort = this.sort;
    this.breachingChannelsDataSource.sort = this.sort;
  }
  /**
   * subscribes to route params
   */
  ngOnInit(): void {
    this.alertDataSource.sortingDataAccessor = nestedPropertyDataAccessor;

    this.alertSelection.changed
      .pipe(
        map((s: SelectionChange<Alert>) => s.added[0]),
        tap((a: Alert) => {
          this.selectedAlert = a;
          this.breachingChannelsDataSource.data = a ? a.breachingChannels : [];
        })
      )
      .subscribe();

    const chanSub = this.route.data
      .pipe(
        tap(() => {
          this.error = false;
        }),
        switchMap((data) => {
          this.monitor = data["monitor"];

          this.breachingChannelColumns = ["channel", this.monitor.stat];
          this.triggerDataSource.data = this.monitor.triggers;
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
          this.alertDataSource.data = alerts;
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
