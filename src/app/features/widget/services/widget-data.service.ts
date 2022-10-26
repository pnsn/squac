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
export type MeasurementParams =
  | MeasurementMeasurementsListRequestParams
  | MeasurementAggregatedListRequestParams;

type MeasurementType = Measurement | Aggregate | Archive;
@Injectable()
export class WidgetDataService implements OnDestroy {
  subscription: Subscription = new Subscription();
  data = new ReplaySubject(1);
  measurementReq: Observable<any>;
  test = new Observable<any>();
  updateTimeout;
  measurementReqSub: Subscription;
  status = new ReplaySubject<string>();

  _params: MeasurementParams = {};
  params = new Subject<MeasurementParams>();
  $params = this.params.asObservable();

  measurementsWithData: number[];
  selectedMetrics: Metric[];

  widgetSub = new ReplaySubject<Widget>(1);
  widget: Widget;

  archiveType: string;
  useAggregate: boolean;
  stat: string;

  private ranges = {};

  constructor(
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
        //only make request when all params present
        return !!this.widget && this.checkParams(params);
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
    this.subscription.add(this.measurementReqSub);
  }

  get dataRange(): any {
    return this.ranges;
  }

  // check params have all data before requesting
  private checkParams(params: MeasurementParams): boolean {
    const valid: boolean =
      params.metric &&
      params.metric.length > 0 &&
      ((params.group && params.group.length > 0) ||
        (params.channel && params.channel.length > 0)) &&
      !!params.starttime &&
      !!params.endtime;
    return valid; //try again once more
  }

  // returns correct request type
  private dataRequest(params): Observable<Array<MeasurementType>> {
    const archiveType = this.archiveType;
    const useAggregate = this.useAggregate;

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
        }
        return this.measurementService.list(params);
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

    try {
      response.forEach((item: MeasurementType) => {
        //for archive/aggregate populate value
        const channelId = item.channelId;
        const metricId = item.metricId;

        if (!dataMap.has(channelId)) {
          const newMap = new Map<number, Array<MeasurementType>>();
          dataMap.set(channelId, newMap);
        }

        if (this.stat && !item.value) {
          item.value = item[this.stat];
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
