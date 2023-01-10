import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import { DATE_PICKER_TIMERANGES } from "@dashboard/components/dashboard-detail/dashboard-time-ranges";
import { catchError, EMPTY, forkJoin, switchMap, tap } from "rxjs";
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

  timeRange: number;
  // time picker config
  datePickerTimeRanges = DATE_PICKER_TIMERANGES;
  starttime: string;
  endtime: string;
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
    let data: ProcessedData;
    // get channel group info from route

    // listen to data changes
    const dataSub = this.widgetDataService.data$
      .pipe(
        switchMap((processedData: ProcessedData | WidgetErrors) => {
          //check if data is a map and has data
          if (processedData instanceof Map) {
            const minMetrics = this.widgetManager.widgetConfig.minMetrics;
            const metricsWithData =
              this.widgetDataService.measurementsWithData.length;
            if (minMetrics > metricsWithData) {
            } else {
              // this.addWidget(this.widgetManager.widgetType);
              this.widgetConfigService.thresholds =
                this.widgetManager.thresholds;
              this.widgetConfigService.dataRange =
                this.widgetDataService.dataRange;
              data = processedData;
            }
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
            this.channelGroupService.read(this.monitor.channelGroupId)
          );
        })
      )
      .subscribe({
        next: (channelGroup: ChannelGroup) => {
          this.widget = new Widget(
            0,
            0,
            "example",
            0,
            [this.monitor.metric],
            "latest"
          );
          this.widget.metrics = [this.monitor.metric];
          this.widget.type = WidgetType.TIMESERIES;
          this.widgetManager.initWidget(this.widget);
          this.widgetManager.widgetConfig;
          this.starttime = this.dateService.format(
            this.dateService.subtractFromNow(1, "day")
          );
          this.endtime = this.dateService.format(this.dateService.now());

          this.widgetManager.updateTimes(this.starttime, this.endtime);
          this.widgetManager.updateChannels(
            this.monitor.channelGroupId,
            channelGroup.channels as Channel[]
          );

          this.widgetManager.updateWidgetType(WidgetType.TIMESERIES);
          this.widgetManager.updateMetrics(this.widget.metrics);
        },
      });
  }

  getAlerts() {
    return this.alertService.list({
      timestampGte: this.widgetManager.starttime,
      timestampLt: this.widgetManager.endtime,
      monitor: this.monitor.id,
    });
  }

  update() {
    this.widgetManager.fetchData();
  }

  datesChanged({ startDate, endDate, liveMode, rangeInSeconds }) {
    if (!startDate || !endDate) {
      startDate = this.dateService.subtractFromNow(rangeInSeconds, "seconds");
      endDate = this.dateService.now();
    }
    console.log(startDate, endDate);
    this.widgetManager.updateTimes(
      this.dateService.format(startDate),
      this.dateService.format(endDate)
    );
  }
}
