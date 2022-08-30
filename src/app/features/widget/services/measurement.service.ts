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
  group: number;
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
      group: params.group,
      starttime: params.starttime,
      endtime: params.endtime,
    });
  }

  // Get measurement aggregate from squac
  getAggregated(params: MeasurementHttpData): Observable<ApiGetAggregate[]> {
    return this.squacApi.get(this.url + "aggregated", null, params);
  }
}
