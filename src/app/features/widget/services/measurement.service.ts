import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Widget } from "@widget/models/widget";
import { SquacApiService } from "@core/services/squacapi.service";
import { ApiGetAggregate } from "@widget/models/aggregate";
import * as dayjs from "dayjs";
import { ApiGetArchive } from "../models/archive";
import { ApiGetMeasurement } from "../models/measurement";
import { DateService } from "@core/services/date.service";
import { tick } from "@angular/core/testing";

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
    metricString: string,
    channelGroupId: number,
    useAggregate: boolean,
    archiveType?: string
  ) {
    const params = {
      metric: metricString,
      group: channelGroupId,
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

  getRandom(max) {
    return Math.random() * max;
  }
}
