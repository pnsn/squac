import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import { DATE_PICKER_TIMERANGES } from "@dashboard/components/dashboard-detail/dashboard-time-ranges";
import {
  TableControls,
  TableFilters,
  TableOptions,
} from "@shared/components/table-view/interfaces";
import { forkJoin, Observable, Subscription, switchMap, tap } from "rxjs";
import {
  Alert,
  AlertService,
  Channel,
  ChannelGroupService,
  MetricService,
  Monitor,
  MonitorService,
  Widget,
} from "squacapi";
import {
  ProcessedData,
  WidgetConfigService,
  WidgetDataService,
  WidgetErrors,
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
  error: boolean;
  alerts: Alert[];
  monitor: Monitor;
  widget: Widget;
  selectedAlert: Alert;
  timeRange: number;
  // time picker config
  datePickerTimeRanges = DATE_PICKER_TIMERANGES;
  starttime: string;
  endtime: string;
  subscriptions = new Subscription();

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
    private changeDetector: ChangeDetectorRef
  ) {}
  // last n intervals
  /**
   * subscribes to route params
   */
  ngOnInit(): void {
    this.columns = [
      { name: "Monitor", prop: "monitorName" },
      {
        name: "Status",
        prop: "inAlarm",
      },
    ];
    let data: ProcessedData;
    // get channel group info from route

    // listen to data changes
    const dataSub = this.widgetDataService.data$
      .pipe(
        switchMap((processedData: ProcessedData | WidgetErrors) => {
          //check if data is a map and has data
          if (processedData instanceof Map) {
            // this.addWidget(this.widgetManager.widgetType);
            this.widgetConfigService.thresholds = this.widgetManager.thresholds;
            this.widgetConfigService.dataRange =
              this.widgetDataService.dataRange;
            data = processedData;
          }

          return this.getAlerts();
        })
      )
      .subscribe({
        next: (alerts: Alert[]) => {
          this.alerts = alerts;
          this.changeDetector.detectChanges();
          this.monitorChart.updateData(data);
        },
      });
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
            })
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
          this.widgetManager.updateChannels(
            this.monitor.channelGroupId,
            results.channelGroup.channels as Channel[]
          );

          this.widgetManager.updateWidgetType(WidgetType.TIMESERIES);
          this.widgetManager.updateMetrics(this.widget.metrics);
        },
      });
    this.subscriptions.add(chanSub);
    this.subscriptions.add(dataSub);
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

  refresh() {}
  /**
   * Requests new data
   */
  update(): void {
    this.widgetManager.fetchData();
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
  }
}
