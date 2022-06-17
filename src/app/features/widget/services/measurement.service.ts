import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Widget } from "@widget/models/widget";
import { SquacApiService } from "@core/services/squacapi.service";
import { ApiGetAggregate } from "@widget/models/aggregate";
import * as dayjs from "dayjs";
import { ApiGetArchive } from "../models/archive";
import { ApiGetMeasurement } from "../models/measurement";
import { DateService } from "@core/services/date.service";

export class MeasurementHttpData {
  metric: string;
  group: number;
  starttime: string;
  endtime: string;
}
@Injectable({
  providedIn: "root",
})
export class MeasurementService {
  private url = "measurement/";
  constructor(
    private squacApi: SquacApiService,
    private dateService: DateService
  ) {}

  // gets data from squac, returns measurements or archives
  getData(
    starttime: string,
    endtime: string,
    widget: Widget,
    useAggregate: boolean,
    archiveType?: string
  ) {
    return this.fakeData(starttime, endtime, widget, useAggregate, archiveType);
    const params = {
      metric: widget.metricsString,
      group: widget.channelGroup.id,
      starttime,
      endtime,
    };
    let path;
    if (archiveType && archiveType !== "raw") {
      path = archiveType + "-archives/";
    } else if (useAggregate) {
      path = "aggregated/";
    } else {
      path = "measurements/";
    }

    return this.squacApi.get(this.url + path, null, params).pipe();
  }

  // Get measurement aggregate from squac
  getAggregated(params: MeasurementHttpData): Observable<ApiGetAggregate[]> {
    return this.squacApi.get(this.url + "aggregated", null, params);
  }

  // const params = {
  //   metric: widget.metricsString,
  //   group: widget.channelGroup.id,
  //   starttime,
  //   endtime,
  // };
  fakeData(start, end, widget, useAggregate, archiveType): Observable<any> {
    //if aggregate each measurement has one
    const data = [];

    widget.metrics.forEach((metric) => {
      widget.channelGroup.channels.forEach((channel) => {
        const skip = this.getRandom(100);
        if (Math.round(skip) % 7 === 0) {
          return;
        }

        if (useAggregate) {
          const item: ApiGetAggregate = {
            channel: channel.id,
            metric: metric.id,
            min: this.getRandom(1),
            max: this.getRandom(100),
            mean: this.getRandom(50),
            median: this.getRandom(50),
            stdev: this.getRandom(20),
            num_samps: this.getRandom(4),
            maxabs: this.getRandom(100),
            minabs: this.getRandom(20),
            p05: 1,
            p10: 20,
            p90: 80,
            p95: 99,
            latest: this.getRandom(20),
            starttime: start,
            endtime: end,
          };

          data.push(item);
        } else if (archiveType && archiveType !== "raw") {
          const startDate = this.dateService.parseUtc(start);
          const endDate = this.dateService.parseUtc(end);
          for (let s: dayjs.Dayjs = startDate; s < endDate; ) {
            let e: dayjs.Dayjs;
            if (archiveType === "hour") {
              e = s.add(1, "hour");
            } else if (archiveType === "month") {
              e = s.add(1, "month");
            } else if (archiveType === "day") {
              e = s.add(1, "day");
            }
            const item: ApiGetArchive = {
              channel: channel.id,
              metric: metric.id,
              id: "1",
              min: this.getRandom(1),
              max: this.getRandom(100),
              mean: this.getRandom(50),
              median: this.getRandom(50),
              stdev: this.getRandom(20),
              num_samps: this.getRandom(4),
              maxabs: this.getRandom(100),
              minabs: this.getRandom(20),
              starttime: this.dateService.format(s),
              endtime: this.dateService.format(e),
              created_at: start,
              updated_at: end,
            };

            if (Math.round(this.getRandom(100)) % 5 !== 0) {
              data.push(item);
            }

            s = e;
          }
        } else {
          const startDate = this.dateService.parseUtc(start);
          const endDate = this.dateService.parseUtc(end);
          const sampleRate = metric.sampleRate || 3000;
          for (let s: dayjs.Dayjs = startDate; s < endDate; ) {
            const e: dayjs.Dayjs = s.add(sampleRate, "seconds");
            const item: ApiGetMeasurement = {
              user_id: "1",
              id: 1,
              channel: channel.id,
              metric: metric.id,
              value: this.getRandom(100),
              starttime: this.dateService.format(s),
              endtime: this.dateService.format(e),
              created_at: this.dateService.format(s),
            };

            if (Math.round(this.getRandom(100)) % 5 !== 0) {
              data.push(item);
            }

            s = e;
          }
        }
      });
    });
    return of(data);
  }

  getRandom(max) {
    return Math.random() * max;
  }
}
