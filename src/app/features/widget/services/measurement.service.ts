import { Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";
import { SquacApiService } from "@core/services/squacapi.service";
import { ApiGetAggregate } from "@widget/models/aggregate";
import { ApiGetMeasurement } from "../models/measurement";
import { ApiGetArchive } from "../models/archive";
import { DateService } from "@core/services/date.service";
import * as dayjs from "dayjs";

export class MeasurementParams {
  starttime: string;
  endtime: string;
  metricString: string;
  channelString: string;
  useAggregate: boolean;
  archiveType?: string;
}

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
    params: MeasurementParams
  ): Observable<ApiGetAggregate[] | ApiGetMeasurement[] | ApiGetArchive[]> {
    let path;
    if (params.archiveType && params.archiveType !== "raw") {
      path = params.archiveType + "-archives/";
    } else if (params.useAggregate) {
      path = "aggregated/";
    } else {
      path = "measurements/";
    }
    // return this.fakeData(params);
    return this.squacApi.get(this.url + path, null, {
      metric: params.metricString,
      channel: params.channelString,
      starttime: params.starttime,
      endtime: params.endtime,
    });
  }

  // Get measurement aggregate from squac
  getAggregated(params: MeasurementHttpData): Observable<ApiGetAggregate[]> {
    return this.squacApi.get(this.url + "aggregated", null, params);
  }

  fakeData(params: MeasurementParams): Observable<any> {
    //if aggregate each measurement has one
    const data = [];
    params.metricString.split(",").forEach((metric) => {
      params.channelString.split(",").forEach((channel) => {
        const base = {
          channel: +channel,
          metric: +metric,
        };
        if (params.useAggregate) {
          const item: ApiGetAggregate = {
            ...base,
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
            starttime: params.starttime,
            endtime: params.endtime,
          };
          data.push(item);
        } else if (params.archiveType && params.archiveType !== "raw") {
          const startDate = this.dateService.parseUtc(params.starttime);
          const endDate = this.dateService.parseUtc(params.endtime);
          for (let s: dayjs.Dayjs = startDate; s < endDate; ) {
            let e: dayjs.Dayjs;
            if (params.archiveType === "hour") {
              e = s.add(1, "hour");
            } else if (params.archiveType === "month") {
              e = s.add(1, "month");
            } else if (params.archiveType === "day") {
              e = s.add(1, "day");
            }
            const item: ApiGetArchive = {
              ...base,
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
              created_at: params.starttime,
              updated_at: params.endtime,
            };

            data.push(item);

            s = e;
          }
        } else {
          const startDate = this.dateService.parseUtc(params.starttime);
          const endDate = this.dateService.parseUtc(params.endtime);

          for (let s: dayjs.Dayjs = startDate; s < endDate; ) {
            const e: dayjs.Dayjs = s.add(10, "minutes");
            const item: ApiGetMeasurement = {
              ...base,
              user_id: "1",
              id: 1,
              value: this.getRandom(100),
              starttime: this.dateService.format(s),
              endtime: this.dateService.format(e),
              created_at: this.dateService.format(s),
            };

            data.push(item);

            s = e;
          }
        }
      });
    });
    return of(data).pipe(delay(1000));
  }

  getRandom(max) {
    return Math.random() * max;
  }
}
