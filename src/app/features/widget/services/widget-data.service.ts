import { Injectable, OnDestroy } from "@angular/core";
import { ConfigurationService } from "@core/services/configuration.service";
import { ViewService } from "@core/services/view.service";
import {
  Subject,
  Subscription,
  Observable,
  switchMap,
  tap,
  filter,
  ReplaySubject,
  catchError,
  EMPTY,
  map,
  forkJoin,
} from "rxjs";
import { Widget } from "../models/widget";
import { MeasurementParams, MeasurementService } from "./measurement.service";
import { Measurement, MeasurementAdapter } from "../models/measurement";
import { Archive, ArchiveAdapter } from "../models/archive";
import { Aggregate, AggregateAdapter } from "../models/aggregate";
import { Metric } from "@core/models/metric";
import { WidgetType } from "../models/widget-type";
import { LoadingService } from "@core/services/loading.service";
import { Channel } from "@core/models/channel";
@Injectable()
export class WidgetDataService implements OnDestroy {
  subscription: Subscription = new Subscription();
  data = new Subject();
  measurementReq: Observable<any>;
  test = new Observable<any>();
  updateTimeout;
  measurementReqSub;
  status = new ReplaySubject<string>();
  groupId: number;
  params = new Subject();
  $params = this.params.asObservable();
  measurementsWithData: number[];
  private nslcStrings: string[];
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
    private aggregateAdapter: AggregateAdapter,
    private loadingService: LoadingService
  ) {
    this.refreshInterval = configService.getValue(
      "dataRefreshIntervalMinutes",
      4
    );

    //listen to viewservice signal to update data
    this.measurementReq = this.$params.pipe(
      filter(() => {
        //  only make request when widget is valid
        return (
          !!this.widget &&
          !!this.metrics &&
          (!!this.groupId || this.nslcStrings?.length > 0)
        );
      }),
      tap(this.startedLoading.bind(this)),
      map((p): Observable<any>[] => {
        return this.nslcStrings.map((string) => {
          const params = this.checkParams({ nslc: string });
          return this.measurementService.getData(params);
        });
      }),
      switchMap((reqs: Observable<any>[]) => {
        return this.loadingService.doLoading(
          forkJoin(reqs).pipe(
            catchError((error) => {
              this.finishedLoading({
                error: "Failed to get measurements from SQUAC",
              });
              return EMPTY;
            }),
            map(this.mapData.bind(this))
          ),
          this.widget
        );
      })
    );

    //destroyed after failed loadign
    this.measurementReqSub = this.measurementReq.subscribe({
      next: (data) => {
        this.finishedLoading(data);
      },
    });

    const updateSub = this.viewService.updateData
      .pipe(
        filter((id) => this.widget && id === this.widget.dashboardId),
        map(() => {
          const channels = this.viewService.channels.getValue();
          return this.nslcQueryStrings(channels);
        }),
        tap((strings) => {
          this.nslcStrings = strings;
          this.params.next({});
          // const strings = this.params.next({});
        })
      )
      .subscribe();

    this.subscription.add(updateSub);
    this.subscription.add(this.measurementReqSub);
  }

  // break up string into multiple to get around
  // request length issue
  private nslcQueryStrings(channels): string[] {
    const queryStrings = [];
    let channelsCount = 0;
    channels.reduce((previous, current, currentIndex) => {
      const nslc = current.nslc;
      const str = previous ? previous + "," + nslc : nslc;
      if (channelsCount > 100 || currentIndex === channels.length - 1) {
        queryStrings.push(str);
        channelsCount = 0;
        return "";
      }
      channelsCount++;
      return str;
    }, "");
    return queryStrings;
  }

  private checkParams(p): MeasurementParams {
    let start;
    let end;
    if (!p.starttime || !p.endtime) {
      start = this.viewService.startTime;
      end = this.viewService.endTime;
    }
    const params: MeasurementParams = {
      starttime: start,
      endtime: end,
      metricString: this.metrics,
      group: this.groupId,
      useAggregate: this.type.useAggregate,
      archiveType: this.viewService.archiveType,
    };

    if (this.groupId) {
      params.group = this.groupId;
    } else {
      params.nslc = p.nslc;
    }
    return params;
  }
  // send data & clear the loading statuses
  private finishedLoading(data) {
    this.data.next(data);
    this.updateMeasurement();
  }

  private startedLoading(): void {
    this.data.next(null);
    this.measurementsWithData = [];
    this.ranges = {};
    this.clearTimeout();
  }

  // format raw squacapi data
  private mapData(response) {
    const widgetStat = this.widget.stat;
    const archiveType = this.viewService.archiveType;
    const archiveStat = this.viewService.archiveStat;
    const useAggregate = this.type.useAggregate;
    const dataMap = new Map<any, Map<number, any>>();
    if (response.error) {
      return response;
    }
    response.forEach((r) => {
      r.forEach((m) => {
        let value: Measurement | Aggregate | Archive;
        if (archiveType && archiveType !== "raw") {
          value = this.archiveAdapter.adaptFromApi(m, archiveStat);
        } else if (useAggregate) {
          value = this.aggregateAdapter.adaptFromApi(m, widgetStat);
        } else {
          value = this.measurementAdapter.adaptFromApi(m);
        }

        if (!dataMap.has(m.channel)) {
          const newMap = new Map<
            number,
            Array<Measurement | Aggregate | Archive>
          >();
          dataMap.set(m.channel, newMap);
        }
        const channelMap = dataMap.get(m.channel);
        if (!channelMap.get(m.metric)) {
          channelMap.set(m.metric, []);
          if (this.measurementsWithData.indexOf(m.metric) < 0) {
            this.measurementsWithData.push(m.metric);
          }
        }
        const metricMap = channelMap.get(m.metric);
        metricMap.push(value);
        this.calculateDataRange(m.metric, value.value);
      });
    });
    if (dataMap.size === 0) {
      return { error: "No measurements found." };
    }
    return dataMap;
  }

  ngOnDestroy(): void {
    this.clearTimeout();
    this.subscription.unsubscribe();
  }

  updateWidget(widget: Widget, type: WidgetType): void {
    this.widget = widget;
    this.type = type;
  }

  updateMetrics(metrics: Metric[]): void {
    if (metrics.length > 0) {
      this.metrics = metrics.toIdString();
    } else {
      this.metrics = this.widget.metricsString;
    }

    this.params.next({});
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
        //
      }, this.refreshInterval * 60 * 1000);
    }
  }
}
