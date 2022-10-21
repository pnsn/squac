import { Injectable, OnDestroy } from "@angular/core";
import { Metric } from "@squacapi/models/metric";
import { LoadingService } from "@core/services/loading.service";
import { ViewService } from "@core/services/view.service";
import {
  MeasurementAggregatedListRequestParams,
  MeasurementMeasurementsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import {
  catchError,
  EMPTY,
  filter,
  map,
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
  switchMap,
  tap,
} from "rxjs";
import { Aggregate } from "@squacapi/models/aggregate";
import { Archive } from "@squacapi/models/archive";
import { Measurement } from "@squacapi/models/measurement";
import { Widget } from "@squacapi/models/widget";
import { WidgetType } from "../models/widget-type";
import { AggregateService } from "@squacapi/services/aggregate.service";
import {
  DayArchiveService,
  HourArchiveService,
  MonthArchiveService,
  WeekArchiveService,
} from "@squacapi/services/archive.service";
import { MeasurementService } from "@squacapi/services/measurement.service";
export enum ArchiveTypes {
  DAY = "day",
  HOUR = "hour",
  WEEK = "week",
  MONTH = "month",
  RAW = "raw",
}
type MeasurementParams =
  | MeasurementMeasurementsListRequestParams
  | MeasurementAggregatedListRequestParams;

type MeasurementType = Measurement | Aggregate | Archive;
@Injectable()
export class WidgetDataService implements OnDestroy {
  subscription: Subscription = new Subscription();
  data = new Subject();
  measurementReq: Observable<any>;
  test = new Observable<any>();
  updateTimeout;
  measurementReqSub: Subscription;
  status = new ReplaySubject<string>();

  _params: MeasurementParams = {};
  params = new Subject<MeasurementParams>();
  $params = this.params.asObservable();

  measurementsWithData: number[];

  private widget: Widget;
  private widgetType: WidgetType;
  private groupId: number;

  private ranges = {};

  constructor(
    private viewService: ViewService,
    private measurementService: MeasurementService,
    private aggregateService: AggregateService,
    private hourArchiveService: HourArchiveService,
    private dayArchiveService: DayArchiveService,
    private monthArchiveService: MonthArchiveService,
    private weekArchiveService: WeekArchiveService,
    private loadingService: LoadingService
  ) {
    // listen to param changes
    this.measurementReq = this.$params.pipe(
      filter((params: MeasurementParams) => {
        const isValid = this.checkParams(params);

        //only make request when all params present
        return isValid;
      }),
      tap(this.startedLoading.bind(this)), // show loading icon
      switchMap((params) => {
        return this.loadingService.doLoading(
          this.dataRequest(params).pipe(
            catchError((error) => {
              console.error(error);
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

    //destroyed after failed loading
    this.measurementReqSub = this.measurementReq.subscribe({
      next: (data) => {
        //process data when returned
        this.finishedLoading(data);
      },
    });

    const updateSub = this.viewService.updateData
      .pipe(
        filter((data) => {
          return (
            // only make changes if it's the correct dashboard and widget
            this.widget &&
            ((data.dashboard && data.dashboard === this.widget.dashboardId) ||
              (data.widget && data.widget === this.widget.id))
          );
        }),
        tap(() => {
          const params = { ...this._params };

          const group = this.viewService.channelGroupId.getValue();
          // group has changed, use for first load
          if (group !== this.groupId) {
            //request using group id
            this.groupId = group;
            delete params.channel;
            params.group = [this.groupId];
          } else {
            const channels = this.viewService.channels.getValue();
            params.channel = channels.map((c) => c.id);
            delete params.group;
          }
          this.params.next(params);
        })
      )
      .subscribe();

    this.subscription.add(updateSub);
    this.subscription.add(this.measurementReqSub);
  }

  get dataRange(): any {
    return this.ranges;
  }

  // check params have all data before requesting
  private checkParams(params: MeasurementParams, attempts = 1): boolean {
    const valid: boolean =
      !!this.widget &&
      params.metric &&
      params.metric.length > 0 &&
      ((params.group && params.group.length > 0) ||
        (params.channel && params.channel.length > 0)) &&
      !!params.starttime &&
      !!params.endtime;

    if (!valid) {
      //try adding dates and try again
      if (!params.starttime || !params.endtime) {
        params.starttime = this.viewService.startTime;
        params.endtime = this.viewService.endTime;
      }
    }
    this._params = { ...params };

    return attempts > 0 && !valid ? this.checkParams(params, 0) : valid; //try again once more

    //       useAggregate: this.widgetType.useAggregate,
    //  archiveType: this.viewService.archiveType,
  }

  // returns correct request type
  private dataRequest(params): Observable<Array<MeasurementType>> {
    const archiveType = this.viewService.archiveType;
    const useAggregate = this.widgetType.useAggregate;

    if (archiveType && archiveType !== "raw") {
      switch (archiveType) {
        case ArchiveTypes.HOUR:
          return this.hourArchiveService.list(params);

        case ArchiveTypes.DAY:
          return this.dayArchiveService.list(params);

        case ArchiveTypes.WEEK:
          return this.weekArchiveService.list(params);

        case ArchiveTypes.MONTH:
          return this.monthArchiveService.list(params);
        default:
          if (useAggregate) {
            //stat: widgetStat
            return this.aggregateService.list(params);
          } else {
            return this.measurementService.list(params);
          }

          break;
      }
    }
  }

  // send data & clear the loading statuses
  private finishedLoading(data) {
    this.data.next(data);
  }

  // clear existing data
  private startedLoading(): void {
    this.data.next(null);
    this.measurementsWithData = [];
    this.ranges = {};
  }

  // format raw squacapi data
  private mapData(response: Array<MeasurementType>) {
    const dataMap = new Map<any, Map<number, any>>();
    const stat = this.widget.stat || this.viewService.archiveStat;
    console.log(stat);
    try {
      response.forEach((item: MeasurementType) => {
        //for archive/aggregate populate value
        const channelId = item.channelId;
        const metricId = item.metricId;

        if (!dataMap.has(channelId)) {
          const newMap = new Map<number, Array<MeasurementType>>();
          dataMap.set(channelId, newMap);
        }

        if (stat && !item.value) {
          item.value = item[stat];
        }

        const channelMap = dataMap.get(channelId);
        if (!channelMap.get(metricId)) {
          channelMap.set(metricId, []);
          if (this.measurementsWithData.indexOf(metricId) < 0) {
            this.measurementsWithData.push(metricId);
          }
        }
        const metricMap = channelMap.get(metricId);
        metricMap.push(item);
        this.calculateDataRange(metricId, item.value);
      });
    } catch {
      return response;
    }

    if (dataMap.size === 0) {
      return { error: "No measurements found." };
    }
    return dataMap;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateWidget(widget: Widget, type: WidgetType): void {
    this.widget = widget;
    this.widgetType = type;
  }

  updateMetrics(metrics: Metric[]): void {
    const params = { ...this._params };
    if (metrics.length > 0) {
      params.metric = metrics.map((m) => m.id);
    } else {
      params.metric = this.widget.metricsIds;
    }
    this.params.next(params);
  }

  /**
   * Calculates the min, max, and count of data for the metric after including the given value
   *
   * @param metricId - id of metric
   * @param value - measurement value to add
   */
  private calculateDataRange(metricId: number, value: number): void {
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
}
