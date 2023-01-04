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

/** Data params */
interface DataParams {
  /** start time of data range */
  starttime: string;
  /** end time of data range */
  endtime: string;
  /** maximum value of data */
  maxValue: number;
  /** metric id */
  metric: number;
  /** channel id */
  channel: number;
}

/**
 * Fakes measurement backends for local
 */
@Injectable({
  providedIn: "root",
})
export class FakeMeasurementBackend {
  constructor(private channelGroupService: ChannelGroupService) {}

  /**
   * Request channels for channel group and maps ids
   *
   * @param group group id
   * @returns observable of channel ids
   */
  private channelsFromGroup(group: number): Observable<number[]> {
    return this.channelGroupService.read(group).pipe(
      map((cg) => {
        return cg.channels.map((channel: Channel) => channel.id);
      })
    );
  }
  /**
   * Returns random number between 0 and maxValue
   *
   * @param maxValue max value to generate
   * @returns random number
   */
  private getRandom(maxValue = 100): number {
    return Math.random() * maxValue;
  }
  /**
   * Returns channel parameters from group id or channel ids
   *
   * @param params measurement params
   * @returns observable of channel ids array
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
   * creates a measurement
   *
   * @param params measurement params
   * @returns measurement
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
   * creates an archive
   *
   * @param params archive params
   * @returns archive
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
   * creates an aggregate
   *
   * @param params aggregate params
   * @returns aggregate
   */
  aggregate(params: DataParams): ReadAggregate {
    const value = this.getRandom(params.maxValue) - 40;

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
   * Creates fake data using the given params
   *
   * @param channels channel ids
   * @param params measurement request params
   * @param datafn datafunction to generate data with
   * @param time amount of time
   * @param timeInterval time interval to use
   * @returns array of data type
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
      const metricMax = this.getRandom();
      console.log(metricMax);
      channels.forEach((c: number) => {
        if (c === 13) return;
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
   * Get list of type
   *
   * @param params request params
   * @param fn data function
   * @param time amount of time
   * @param timeInterval interval of time
   * @returns observable of typea
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
   * Measurement list function
   *
   * @param params measurement params
   * @returns observable of measurement data
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
   * Aggregated list function
   *
   * @param params aggregated params
   * @returns observable of aggregated data
   */
  measurementAggregatedList(
    params: MeasurementAggregatedListRequestParams
  ): Observable<ReadAggregate[]> {
    return this.getList<ReadAggregate>(params, this.aggregate.bind(this));
  }

  /**
   * Archive list function
   *
   * @param params archive params
   * @returns observable of archives data
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
   * Archive list function
   *
   * @param params archive params
   * @returns observable of archives data
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
   * Archive list function
   *
   * @param params archive params
   * @returns observable of archives data
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

  /**
   * Archive list function
   *
   * @param params archive params
   * @returns observable of archives data
   */
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
