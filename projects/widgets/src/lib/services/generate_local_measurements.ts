import { Injectable } from "@angular/core";
// import { DateService } from "../projects/squac-ui/src/app/core/services/date.service";
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
@Injectable({
  providedIn: "root",
})
export class FakeMeasurementBackend {
  constructor(
    // private dateService: DateService,
    private channelGroupService: ChannelGroupService
  ) {}

  private channelsFromGroup(group: number): Observable<number[]> {
    return this.channelGroupService.read(group).pipe(
      map((group) => {
        return group.channels.map((channel: Channel) => channel.id);
      })
    );
  }
  private getRandom(maxValue = 100): number {
    return Math.random() * maxValue;
  }
  private getChannels(params: MeasurementParams): Observable<number[]> {
    if (params.group) {
      return this.channelsFromGroup(params.group[0]);
    } else if (params.channel) {
      return of(params.channel);
    }
    return of([]);
  }

  measurement(params: DataParams): ReadMeasurement {
    return {
      starttime: params.starttime,
      endtime: params.endtime,
      value: this.getRandom(params.maxValue),
      metric: params.metric,
      channel: params.channel,
    };
  }

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
      channels.forEach((c: number) => {
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

          const measurement = datafn(start, end, metricMax, m, c);
          measurements.push(measurement);
          currentTime = newEnd;
        }
      });
    });
    return measurements;
  }

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

  measurementAggregatedList(
    params: MeasurementAggregatedListRequestParams
  ): Observable<ReadAggregate[]> {
    return this.getList<ReadAggregate>(params, this.aggregate.bind(this));
  }

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
