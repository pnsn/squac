/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param-description */
import { Injectable } from "@angular/core";
import { parseUtc, format } from "../shared/utils";
import {
  MeasurementAggregatedListRequestParams,
  MeasurementDayArchivesListRequestParams,
  MeasurementHourArchivesListRequestParams,
  MeasurementMeasurementsListRequestParams,
  MeasurementMonthArchivesListRequestParams,
  MeasurementWeekArchivesListRequestParams,
  ReadOnlyArchiveDaySerializer,
  ReadOnlyArchiveHourSerializer,
  ReadOnlyArchiveMonthSerializer,
  ReadOnlyArchiveWeekSerializer,
} from "@pnsn/ngx-squacapi-client";
import {
  ReadArchive,
  ReadAggregate,
  Channel,
  ReadMeasurement,
  MeasurementParams,
} from "squacapi";
import { ChannelGroupService } from "squacapi";
import { map, Observable, of } from "rxjs";

type TimeInterval = "minutes" | "day" | "hour" | "week" | "month";
interface DataParams {
  starttime: string;
  endtime: string;
  maxValue: number;
  metric: number;
  channel: number;
}
/**
 *
 */
@Injectable({
  providedIn: "root",
})
export class FakeMeasurementBackend {
  constructor(private channelGroupService: ChannelGroupService) {}

  /**
   *
   * @param group
   */
  private channelsFromGroup(group: number): Observable<number[]> {
    return this.channelGroupService.read(group).pipe(
      map((cg) => {
        return cg.channels.map((channel: Channel) => channel.id);
      })
    );
  }
  /**
   *
   * @param maxValue
   */
  private getRandom(maxValue = 100): number {
    return Math.random() * maxValue;
  }
  /**
   *
   * @param params
   */
  private getChannels(params: MeasurementParams): Observable<number[]> {
    if (params.group) {
      return this.channelsFromGroup(params.group[0]);
    } else if (params.channel) {
      return of(params.channel);
    }
    return of([]);
  }

  /**
   *
   * @param params
   */
  measurement(params: DataParams): ReadMeasurement {
    return {
      starttime: params.starttime,
      endtime: params.endtime,
      value: this.getRandom(params.maxValue),
      metric: params.metric,
      channel: params.channel,
    };
  }

  /**
   *
   * @param params
   */
  archive(params: DataParams): ReadArchive {
    const value = this.getRandom(params.maxValue);
    return {
      starttime: params.starttime,
      endtime: params.endtime,
      metric: params.metric,
      channel: params.channel,
      min: value,
      max: value,
      mean: value,
      median: value,
      stdev: value,
      num_samps: value,
      p05: value,
      p10: value,
      p90: value,
      p95: value,
      minabs: `${value}`,
      maxabs: `${value}`,
    };
  }

  /**
   *
   * @param params
   */
  aggregate(params: DataParams): ReadAggregate {
    const value = this.getRandom(params.maxValue);
    return {
      starttime: params.starttime,
      endtime: params.endtime,
      metric: params.metric,
      channel: params.channel,
      min: value,
      max: value,
      mean: value,
      median: value,
      stdev: value,
      num_samps: value,
      p05: value,
      p10: value,
      p90: value,
      p95: value,
      minabs: value,
      maxabs: value,
      latest: value,
    };
  }

  /**
   *
   * @param channels
   * @param params
   * @param datafn
   * @param time
   * @param timeInterval
   */
  getData<T>(
    channels: number[],
    params: MeasurementParams,
    datafn,
    time: number,
    timeInterval?: TimeInterval
  ): T[] {
    const measurements: T[] = [];
    let starttime = parseUtc(params.starttime);
    let endtime = parseUtc(params.endtime);
    if (endtime < starttime) {
      const s = starttime;
      starttime = endtime;
      endtime = s;
    }
    params.metric.forEach((m: number) => {
      channels.forEach((c: number) => {
        const metricMax = this.getRandom();
        let currentTime = starttime;
        while (currentTime < endtime) {
          let newEnd;
          if (timeInterval) {
            newEnd = currentTime.add(time, timeInterval);
            if (newEnd > endtime) {
              return;
            }
          } else {
            newEnd = endtime;
          }

          const start = format(currentTime);
          const end = format(newEnd);

          const measurement = datafn({
            starttime: start,
            endtime: end,
            maxValue: metricMax,
            metric: m,
            channel: c,
          });
          measurements.push(measurement);
          currentTime = newEnd;
        }
      });
    });
    return measurements;
  }

  /**
   *
   * @param params
   * @param fn
   * @param time
   * @param timeInterval
   */
  getList<T>(
    params: MeasurementParams,
    fn: (params: DataParams) => T[],
    time?: number,
    timeInterval?: TimeInterval
  ): Observable<T[]> {
    // const randomDelay = Math.round(Math.random() * 20) * 1000;
    return this.getChannels(params).pipe(
      // delay(randomDelay),
      map((channels: number[]) => {
        return this.getData<T>(channels, params, fn, time, timeInterval);
      })
    );
  }

  /**
   *
   * @param params
   */
  measurementMeasurementsList(
    params: MeasurementMeasurementsListRequestParams
  ): Observable<ReadMeasurement[]> {
    return this.getList<ReadMeasurement>(
      params,
      this.measurement.bind(this),
      10,
      "minutes"
    );
  }

  /**
   *
   * @param params
   */
  measurementAggregatedList(
    params: MeasurementAggregatedListRequestParams
  ): Observable<ReadAggregate[]> {
    return this.getList<ReadAggregate>(params, this.aggregate.bind(this));
  }

  /**
   *
   * @param params
   */
  measurementDayArchivesList(
    params: MeasurementDayArchivesListRequestParams
  ): Observable<ReadOnlyArchiveDaySerializer[]> {
    return this.getList<ReadArchive>(
      params,
      this.archive.bind(this),
      1,
      "day"
    ).pipe();
  }

  /**
   *
   * @param params
   */
  measurementHourArchivesList(
    params: MeasurementHourArchivesListRequestParams
  ): Observable<ReadOnlyArchiveHourSerializer[]> {
    return this.getList<ReadArchive>(
      params,
      this.archive.bind(this),
      1,
      "hour"
    );
  }

  /**
   *
   * @param params
   */
  measurementWeekArchivesList(
    params: MeasurementWeekArchivesListRequestParams
  ): Observable<ReadOnlyArchiveWeekSerializer[]> {
    return this.getList<ReadArchive>(
      params,
      this.archive.bind(this),
      1,
      "week"
    );
  }

  measurementMonthArchivesList(
    params: MeasurementMonthArchivesListRequestParams
  ): Observable<ReadOnlyArchiveMonthSerializer[]> {
    return this.getList<ReadArchive>(
      params,
      this.archive.bind(this),
      1,
      "month"
    );
  }
}
