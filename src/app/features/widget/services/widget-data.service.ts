import { Injectable, OnDestroy } from "@angular/core";
import { ConfigurationService } from "@core/services/configuration.service";
import { ViewService } from "@core/services/view.service";
import {
  Subject,
  Subscription,
  map,
  Observable,
  switchMap,
  of,
  tap,
  filter,
} from "rxjs";
import { Widget } from "../models/widget";
import { MeasurementParams, MeasurementService } from "./measurement.service";
import { Measurement, MeasurementAdapter } from "../models/measurement";
import { Archive, ArchiveAdapter } from "../models/archive";
import { Aggregate, AggregateAdapter } from "../models/aggregate";
import { Metric } from "@core/models/metric";
import { id } from "@swimlane/ngx-datatable";
import { Channel } from "@core/models/channel";
@Injectable()
export class WidgetDataService implements OnDestroy {
  subscription: Subscription = new Subscription();
  data = new Subject();
  measurementReq: Observable<any>;
  params = new Subject<any>();
  $params = this.params.asObservable();
  test = new Observable<any>();
  updateTimeout;
  measurementReqSub;
  status = new Subject();
  channels: Channel[];
  private widget: Widget;
  private metrics: string;
  private type: any;
  private refreshInterval: number;

  private ranges = {};

  constructor(
    private viewService: ViewService,
    private measurementService: MeasurementService,
    configService: ConfigurationService,
    private measurementAdapter: MeasurementAdapter,
    private archiveAdapter: ArchiveAdapter,
    private aggregateAdapter: AggregateAdapter
  ) {
    this.refreshInterval = configService.getValue(
      "dataRefreshIntervalMinutes",
      4
    );

    this.measurementReq = this.$params.pipe(
      filter((params) => {
        console.log("Current request", params);
        //widget has metrics, channels
        return this.widget && this.metrics && this.channels.length > 0; //filter to make sure there's the correct
      }),
      map((p) => {
        let start;
        let end;
        if (!p.starttime || !p.endtime) {
          start = this.viewService.startTime;
          end = this.viewService.endTime;
        }
        const channelString = this.viewService.channelsString;
        const params: MeasurementParams = {
          starttime: start,
          endtime: end,
          metricString: this.metrics,
          channelString: channelString,
          useAggregate: this.type.useAggregate,
          archiveType: this.viewService.archiveType,
        };
        return params;
      }),
      tap(() => {
        this.data.next(null);
        this.ranges = {};
        this.viewService.widgetStartedLoading();
        this.status.next("Fetching Data");
      }),
      switchMap((params: MeasurementParams) => {
        console.log(params);
        this.clearTimeout();
        return this.measurementService.getData(params);
      })
    );

    this.measurementReqSub = this.measurementReq
      .pipe(
        map((response) => {
          const widgetStat = this.widget.stat;
          const archiveType = this.viewService.archiveType;
          const archiveStat = this.viewService.archiveStat;
          const useAggregate = this.type.useAggregate;

          const data = {};
          console.log("Loaded measurements: ", response.length);
          response.forEach((m) => {
            let value: Measurement | Aggregate | Archive;
            if (archiveType && archiveType !== "raw") {
              value = this.archiveAdapter.adaptFromApi(m, archiveStat);
            } else if (useAggregate) {
              value = this.aggregateAdapter.adaptFromApi(m, widgetStat);
            } else {
              value = this.measurementAdapter.adaptFromApi(m);
            }

            if (!data[m.channel]) {
              data[m.channel] = {};
            }
            if (!data[m.channel][m.metric]) {
              data[m.channel][m.metric] = [];
            }
            this.calculateDataRange(m.metric, value.value);
            data[m.channel][m.metric].push(value);
          });
          return data;
        })
      )
      .subscribe({
        next: (data) => {
          this.data.next(data);
          this.viewService.widgetFinishedLoading();
          this.updateMeasurement();
          this.status.next(null);
        },
        error: (error) => {
          console.error("error in fetch measurements ", error);
          this.viewService.widgetFinishedLoading();
          this.data.next({});
          this.updateMeasurement();
          this.status.next(null);
        },
      });

    const channelsSub = this.viewService.channels.subscribe({
      next: (channels) => {
        this.channels = channels;
        this.params.next("channels");
      },
      error: (error) => {
        console.error("error in channel load for widgets ", error);
      },
    });
  }

  ngOnDestroy(): void {
    this.clearTimeout();
    this.measurementReqSub.unsubscribe();
    this.subscription.unsubscribe();
  }

  setWidget(widget: Widget): void {
    this.widget = widget;
    this.params.next("widget");
  }

  setMetrics(metrics: Metric[]): void {
    if (metrics.length > 0) {
      const temp = [];
      metrics.forEach((metric) => {
        temp.push(metric.id);
      });
      this.metrics = temp.toString();
    } else {
      this.metrics = this.widget.metricsString;
    }
    this.params.next("metrics");
  }

  //channels change, metrics change, or widget info change

  setType(type: any): void {
    this.type = type;
  }

  get dataRange() {
    return this.ranges;
  }

  getMeasurements(): Observable<any> {
    return of(["measurements"]);
  }

  private calculateDataRange(metricId, value): void {
    if (!this.ranges[metricId]) {
      this.ranges[metricId] = {
        min: null,
        max: null,
        count: 0,
      };
    }

    const metricRange = this.ranges[metricId];
    if (metricRange.min === null || value < metricRange.min) {
      metricRange.min = value;
    }
    if (metricRange.max === null || value > metricRange.max) {
      metricRange.max = value;
    }

    metricRange.count++;
  }

  // Clears any active timeout
  private clearTimeout(): void {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
  }

  private updateMeasurement(): void {
    if (this.viewService.isLive) {
      this.updateTimeout = setTimeout(() => {
        this.params.next({
          starttime: this.viewService.startTime,
          endtime: this.viewService.endTime,
        });
      }, this.refreshInterval * 60 * 1000);
    }
  }
}
