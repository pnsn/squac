import { Injectable, OnDestroy } from "@angular/core";
import { ConfigurationService } from "@core/services/configuration.service";
import { ViewService } from "@core/services/view.service";
import {
  Subject,
  Subscription,
  map,
  Observable,
  switchMap,
  tap,
  filter,
  ReplaySubject,
} from "rxjs";
import { Widget } from "../models/widget";
import { MeasurementParams, MeasurementService } from "./measurement.service";
import { Measurement, MeasurementAdapter } from "../models/measurement";
import { Archive, ArchiveAdapter } from "../models/archive";
import { Aggregate, AggregateAdapter } from "../models/aggregate";
import { Metric } from "@core/models/metric";
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
  status = new ReplaySubject<string>();
  channels: Channel[];

  requestInProgress = false;
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
      filter(() => {
        //  only make request when widget is valid
        return this.widget && this.metrics && this.channels.length > 0;
      }),
      map(this.checkParams.bind(this)),
      tap(this.startedLoading.bind(this)),
      switchMap((params: MeasurementParams) => {
        return this.measurementService.getData(params);
      })
    );

    this.measurementReqSub = this.measurementReq
      .pipe(map(this.mapData.bind(this)))
      .subscribe({
        next: (data) => {
          this.finishedLoading(data);
        },
        error: (error) => {
          this.finishedLoading({});
          console.error("error in fetch measurements ", error);
        },
      });

    const channelsSub = this.viewService.channels.subscribe({
      next: (channels) => {
        this.channels = channels;
        this.params.next("channels changed." + this.widget?.name);
      },
    });
    this.subscription.add(channelsSub);
    this.subscription.add(this.measurementReqSub);
  }

  private checkParams(p): MeasurementParams {
    console.log(p);
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
  }
  // send data & clear the loading statuses
  private finishedLoading(data) {
    this.data.next(data);
    this.viewService.widgetFinishedLoading();
    this.updateMeasurement();
    this.requestInProgress = false;
  }

  private startedLoading(): void {
    if (this.requestInProgress) {
      this.viewService.widgetFinishedLoading();
    }
    this.requestInProgress = true;
    this.data.next(null);
    this.ranges = {};
    this.viewService.widgetStartedLoading();
    this.clearTimeout();
  }

  // format raw squacapi data
  private mapData(response) {
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
  }

  ngOnDestroy(): void {
    console.log(this.widget.name);
    this.viewService.widgetFinishedLoading();
    this.clearTimeout();
    this.subscription.unsubscribe();
  }

  updateWidget(widget: Widget, type: any): void {
    this.widget = widget;
    this.type = type;
    this.params.next("widget changed." + this.widget?.name);
  }

  updateMetrics(metrics: Metric[]): void {
    if (metrics.length > 0) {
      const temp = [];
      metrics.forEach((metric) => {
        temp.push(metric.id);
      });
      this.metrics = temp.toString();
    } else {
      this.metrics = this.widget.metricsString;
    }
    this.params.next("metrics changed." + this.widget?.name);
  }

  get dataRange(): any {
    return this.ranges;
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
