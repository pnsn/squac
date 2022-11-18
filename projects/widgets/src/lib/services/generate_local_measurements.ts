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
  ReadOnlyArchiveHourSerializer,
  ReadOnlyArchiveMonthSerializer,
  ReadOnlyArchiveWeekSerializer,
  ReadOnlyMeasurementSerializer,
} from "@pnsn/ngx-squacapi-client";
import { ReadArchive, ReadAggregate } from "squacapi";
import { ChannelGroupService } from "squacapi";
import { map, Observable, of } from "rxjs";

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
        return group.channels.map((channel) => channel.id);
      })
    );
  }
  private getRandom(maxValue = 100) {
    return Math.random() * maxValue;
  }
  private getChannels(params): Observable<number[]> {
    if (params.group) {
      return this.channelsFromGroup(params.group);
    } else if (params.channel) {
      return of(params.channel);
    }
    return of([]);
  }

  measurement(
    starttime,
    endtime,
    maxValue,
    metric,
    channel
  ): ReadOnlyMeasurementSerializer {
    return {
      starttime,
      endtime,
      value: this.getRandom(maxValue),
      metric,
      channel,
    };
  }

  archive(starttime, endtime, maxValue, metric, channel): ReadArchive {
    const value = this.getRandom(maxValue);
    return {
      starttime,
      endtime,
      channel,
      metric,
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

  aggregate(starttime, endtime, maxValue, metric, channel): ReadAggregate {
    const value = this.getRandom(maxValue);
    return {
      starttime,
      endtime,
      metric,
      channel,
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

  getData(channels, params, datafn, time, timeInterval?) {
    const measurements = [];
    let starttime = parseUtc(params.starttime);
    let endtime = parseUtc(params.endtime);
    if (endtime < starttime) {
      const s = starttime;
      starttime = endtime;
      endtime = s;
    }
    params.metric.forEach((m) => {
      const metricMax = this.getRandom();
      channels.forEach((c) => {
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

  getList(params, fn, time?, timeInterval?) {
    // const randomDelay = Math.round(Math.random() * 20) * 1000;
    return this.getChannels(params).pipe(
      // delay(randomDelay),
      map((channels: number[]) => {
        return this.getData(channels, params, fn, time, timeInterval);
      })
    );
  }

  measurementMeasurementsList(
    params: MeasurementMeasurementsListRequestParams
  ): Observable<ReadOnlyMeasurementSerializer[]> {
    return this.getList(params, this.measurement.bind(this), 10, "minutes");
  }

  measurementAggregatedList(
    params: MeasurementAggregatedListRequestParams
  ): Observable<ReadAggregate[]> {
    return this.getList(params, this.aggregate.bind(this));
  }

  measurementDayArchivesList(
    params: MeasurementDayArchivesListRequestParams
  ): Observable<any> {
    return this.getList(params, this.archive.bind(this), 1, "day").pipe();
  }

  measurementHourArchivesList(
    params: MeasurementHourArchivesListRequestParams
  ): Observable<ReadOnlyArchiveHourSerializer[]> {
    return this.getList(params, this.archive.bind(this), 1, "hour");
  }

  measurementWeekArchivesList(
    params: MeasurementWeekArchivesListRequestParams
  ): Observable<ReadOnlyArchiveWeekSerializer[]> {
    return this.getList(params, this.archive.bind(this), 1, "week");
  }

  measurementMonthArchivesList(
    params: MeasurementMonthArchivesListRequestParams
  ): Observable<ReadOnlyArchiveMonthSerializer[]> {
    return this.getList(params, this.archive.bind(this), 1, "month");
  }
}
