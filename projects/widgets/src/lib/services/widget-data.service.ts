import { Injectable, OnDestroy } from "@angular/core";
import {
  catchError,
  EMPTY,
  filter,
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
  switchMap,
  tap,
} from "rxjs";

import { MeasurementTypes } from "squacapi";
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
import { DataRange, ProcessedData } from "../interfaces";

/**
 * Service for requesting and processing data for a widget
 */
@Injectable()
export class WidgetDataService implements OnDestroy {
  private subscription: Subscription = new Subscription();

  // Actual requests
  private measurementReq$: Observable<MeasurementTypes[] | WidgetErrors>;
  private measurementReqSub: Subscription;

  // Tracks request progress
  isLoading$ = new BehaviorSubject<boolean>(false);

  // Request params, will trigger new request
  params$ = new Subject<MeasurementParams>();
  private paramsObs$ = this.params$.asObservable();

  // actual data
  data$ = new ReplaySubject<WidgetErrors | MeasurementTypes[]>(1);
  // ids of measurements that have data
  measurementsWithData: number[] = [];

  // data info
  archiveType!: ArchiveType;
  useAggregate!: boolean;
  stat!: string | WidgetStatType | ArchiveStatType;

  // ranges of data for metrics
  private ranges: DataRange = {};

  constructor(
    private measurementService: MeasurementService,
    private aggregateService: AggregateService,
    private dayArchiveService: DayArchiveService,
    private monthArchiveService: MonthArchiveService,
    private weekArchiveService: WeekArchiveService
  ) {
    // listen to param changes and make request
    this.measurementReq$ = this.paramsObs$.pipe(
      filter((params: MeasurementParams) => {
        //only make request when all params present
        return this.checkParams(params);
      }),
      tap(this.startedLoading.bind(this)), // show loading icon
      switchMap((params) => {
        // make data request
        return this.dataRequest(params).pipe(
          catchError(() => {
            // stop loading on error
            this.finishedLoading();
            return EMPTY;
          })
          // map((data) => {
          //   // map data on success
          //   return this.mapData(data);
          // })
        );
      })
    );

    // FIXME: destroyed after failed loading
    this.measurementReqSub = this.measurementReq$.subscribe({
      next: (processedData: MeasurementTypes[] | WidgetErrors) => {
        //process data when returned
        this.finishedLoading(processedData);
      },
    });
    this.subscription.add(this.measurementReqSub);
  }

  /** @returns data range */
  get dataRange(): DataRange {
    return this.ranges;
  }

  // check params have all data before requesting
  /**
   * Validates request params
   *
   * @param params - request parameters
   * @returns true if request parameters are valid
   */
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

  /**
   * Returns list request from correct service
   *
   * @param params - request parameters
   * @returns - request observable
   */
  private dataRequest(
    params: MeasurementParams
  ): Observable<MeasurementTypes[]> {
    const archiveType = this.archiveType;
    const useAggregate = this.useAggregate;
    switch (archiveType) {
      case "day":
        return this.dayArchiveService.list(params);

      case "week":
        return this.weekArchiveService.list(params);

      case "month":
        return this.monthArchiveService.list(params);

      case "raw":
        if (useAggregate) {
          return this.aggregateService.list(params);
        }
        return this.measurementService.list(params);
      default:
        return this.measurementService.list(params);
    }
  }

  /**
   * Emits data or error and stops loading
   *
   * @param data - processed data or error message
   */
  private finishedLoading(data?: MeasurementTypes[] | WidgetErrors): void {
    if (!data) {
      this.data$.next(WidgetErrors.SQUAC_ERROR);
      //squac error
    } else if (data.length === 0) {
      this.data$.next(WidgetErrors.NO_MEASUREMENTS);
    } else {
      this.data$.next(data);
    }
    this.isLoading$.next(false);
  }

  /**
   * Clear existing data and start request
   */
  private startedLoading(): void {
    this.measurementsWithData = [];
    this.ranges = {};
    this.isLoading$.next(true);
  }

  /**
   * Maps and sorts raw json response from squacapi into Measurement types
   *
   * @param response - response data from squacapi
   * @returns processed data or widget error
   */
  mapData(response: MeasurementTypes[]): ProcessedData | WidgetErrors {
    const dataMap: ProcessedData = new Map<
      number,
      Map<number, MeasurementTypes[]>
    >();

    try {
      response.forEach((item: MeasurementTypes) => {
        const channelId: number = item.channel;
        const metricId: number = item.metric;

        let channelMap = dataMap.get(channelId);

        if (!channelMap) {
          channelMap = new Map<number, MeasurementTypes[]>();
          dataMap.set(channelId, channelMap);
        }

        const metricValues = channelMap.get(metricId) ?? [];

        if (!this.measurementsWithData.includes(metricId)) {
          this.measurementsWithData.push(metricId);
        }

        //for archive/aggregate populate value
        const value = item.value ?? item[this.stat];
        item.value = value;

        metricValues.push(item);
        channelMap.set(metricId, metricValues);
        this.calculateDataRange(metricId, value);
      });
    } catch {
      return WidgetErrors.SQUAC_ERROR;
    }
    return dataMap;
  }

  /**
   * unsubscribe
   */
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
    const metricRange =
      metricId in this.ranges ? this.ranges[metricId] : { count: 0 };

    if (metricRange.min === undefined || value < metricRange.min) {
      metricRange.min = value;
    }
    if (metricRange.max === undefined || value > metricRange.max) {
      metricRange.max = value;
    }
    if (metricRange.count) metricRange.count++;
    this.ranges[metricId] = metricRange;
  }
}
