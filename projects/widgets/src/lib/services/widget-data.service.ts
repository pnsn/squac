import { Injectable, OnDestroy } from "@angular/core";
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

import { Metric, Archive, Aggregate, Measurement, Widget } from "squacapi";
import {
  AggregateService,
  DayArchiveService,
  MonthArchiveService,
  WeekArchiveService,
  MeasurementService,
} from "squacapi";
import { MeasurementParams } from "squacapi";
import { WidgetErrors } from "../enums";
import { BehaviorSubject } from "rxjs";
import { ArchiveType, ArchiveStatType, WidgetStatType } from "squacapi";

type MeasurementType = Measurement | Aggregate | Archive;
@Injectable()
export class WidgetDataService implements OnDestroy {
  subscription: Subscription = new Subscription();
  private measurementReq: Observable<any>;
  private measurementReqSub: Subscription;

  isLoading$ = new BehaviorSubject<boolean>(false);
  params = new Subject<MeasurementParams>();
  private $params = this.params.asObservable();

  // actual data

  data = new ReplaySubject<WidgetErrors | Map<any, any>>(1);
  measurementsWithData: number[] = [];

  // data info
  selectedMetrics: Metric[] = [];
  widget: Widget;
  archiveType: ArchiveType;
  useAggregate: boolean;
  stat: string | WidgetStatType | ArchiveStatType;

  private ranges = {};

  constructor(
    private measurementService: MeasurementService,
    private aggregateService: AggregateService,
    private dayArchiveService: DayArchiveService,
    private monthArchiveService: MonthArchiveService,
    private weekArchiveService: WeekArchiveService
  ) {
    // listen to param changes
    this.measurementReq = this.$params.pipe(
      filter((params: MeasurementParams) => {
        //only make request when all params present
        return !!this.widget && this.checkParams(params);
      }),
      tap(this.startedLoading.bind(this)), // show loading icon
      switchMap((params) => {
        return this.dataRequest(params).pipe(
          catchError(() => {
            this.finishedLoading();
            return EMPTY;
          }),
          map(this.mapData.bind(this))
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
      // case ArchiveType.HOUR:
      //   return this.hourArchiveService.list(params);

      case "day":
        return this.dayArchiveService.list(params);

      case "week":
        return this.weekArchiveService.list(params);

      case "month":
        return this.monthArchiveService.list(params);
      case "raw":
        if (useAggregate) {
          //stat: widgetStat
          return this.aggregateService.list(params);
        }
        return this.measurementService.list(params);

      default:
    }
  }

  // send data & clear the loading statuses
  private finishedLoading(data?: Map<any, any>) {
    if (!data) {
      this.data.next(WidgetErrors.SQUAC_ERROR);
      //squac error
    } else if (data.size === 0) {
      this.data.next(WidgetErrors.NO_MEASUREMENTS);
    } else {
      this.data.next(data);
    }
    this.isLoading$.next(false);
  }

  // clear existing data
  private startedLoading(): void {
    this.measurementsWithData = [];
    this.ranges = {};
    this.isLoading$.next(true);
  }

  // format raw squacapi data
  mapData(response: Array<MeasurementType>) {
    const dataMap = new Map<number, Map<number, Array<MeasurementType>>>();
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
    } catch (e) {
      console.error("Error in widget response", e);
      return response;
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
