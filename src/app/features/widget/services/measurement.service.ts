import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SquacApiService } from "@core/services/squacapi.service";
import { ApiGetAggregate } from "@widget/models/aggregate";
import { ApiGetMeasurement } from "../models/measurement";
import { ApiGetArchive } from "../models/archive";

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
  constructor(private squacApi: SquacApiService) {}

  // gets data from squac, returns measurements or archives
  getData(
    starttime: string,
    endtime: string,
    metricString: string,
    channelString: string,
    useAggregate: boolean,
    archiveType?: string
  ): Observable<ApiGetAggregate[] | ApiGetMeasurement[] | ApiGetArchive[]> {
    const params = {
      metric: metricString,
      channel: channelString,
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

    return this.squacApi.get(this.url + path, null, params);
  }

  // Get measurement aggregate from squac
  getAggregated(params: MeasurementHttpData): Observable<ApiGetAggregate[]> {
    return this.squacApi.get(this.url + "aggregated", null, params);
  }
}
