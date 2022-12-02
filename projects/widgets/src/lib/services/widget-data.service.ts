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

import { Metric, MeasurementTypes } from "squacapi";
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

@Injectable()
export class WidgetDataService implements OnDestroy {
  private subscription: Subscription = new Subscription();
  private measurementReq$: Observable<ProcessedData | WidgetErrors>;
  private measurementReqSub: Subscription;

  isLoading$ = new BehaviorSubject<boolean>(false);
  params$ = new Subject<MeasurementParams>();
  private paramsObs$ = this.params$.asObservable();

  // actual data
  data$ = new ReplaySubject<WidgetErrors | ProcessedData>(1);
  measurementsWithData: number[] = [];

  // data info
  selectedMetrics: Metric[] = [];
  archiveType!: ArchiveType;
  useAggregate!: boolean;
  stat!: string | WidgetStatType | ArchiveStatType;

  private ranges: DataRange = {};

  constructor(
    private measurementService: MeasurementService,
    private aggregateService: AggregateService,
    private dayArchiveService: DayArchiveService,
    private monthArchiveService: MonthArchiveService,
    private weekArchiveService: WeekArchiveService
  ) {
    // listen to param changes
    this.measurementReq$ = this.paramsObs$.pipe(
      filter((params: MeasurementParams) => {
        //only make request when all params present
        return this.checkParams(params);
      }),
      tap(this.startedLoading.bind(this)), // show loading icon
      switchMap((params) => {
        return this.dataRequest(params).pipe(
          catchError(() => {
            this.finishedLoading();
            return EMPTY;
          }),
          map((data) => {
            return this.mapData(data);
          })
        );
      })
    );

    //destroyed after failed loading
    this.measurementReqSub = this.measurementReq$.subscribe({
      next: (processedData: ProcessedData | WidgetErrors) => {
        //process data when returned
        this.finishedLoading(processedData);
      },
    });
    this.subscription.add(this.measurementReqSub);
  }

  get dataRange(): DataRange {
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
  private dataRequest(
    params: MeasurementParams
  ): Observable<MeasurementTypes[]> {
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
        return this.measurementService.list(params);
    }
  }

  // send data & clear the loading statuses
  private finishedLoading(data?: ProcessedData | WidgetErrors): void {
    if (!data) {
      this.data$.next(WidgetErrors.SQUAC_ERROR);
      //squac error
    } else if (data instanceof Map && data.size === 0) {
      this.data$.next(WidgetErrors.NO_MEASUREMENTS);
    } else {
      this.data$.next(data);
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
  mapData(response: MeasurementTypes[]): ProcessedData | WidgetErrors {
    const dataMap: ProcessedData = new Map<
      number,
      Map<number, MeasurementTypes[]>
    >();
    try {
      response.forEach((item: MeasurementTypes) => {
        //for archive/aggregate populate value
        const channelId: number = item.channelId;
        const metricId: number = item.metricId;

        let channelMap = dataMap.get(channelId);

        if (!channelMap) {
          channelMap = new Map<number, MeasurementTypes[]>();
          dataMap.set(channelId, channelMap);
        }

        const metricValues = channelMap.get(metricId) ?? [];

        if (!this.measurementsWithData.includes(metricId)) {
          this.measurementsWithData.push(metricId);
        }

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
