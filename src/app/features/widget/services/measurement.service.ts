import { Injectable } from "@angular/core";
import { ReadArchive, ReadMeasurement } from "@core/models/squac-types";
import { SquacApiService } from "@core/services/squacapi.service";
import { ReadAggregate } from "@widget/models/aggregate";
import { Observable } from "rxjs";

export class MeasurementParams {
  starttime: string;
  endtime: string;
  metricString: string;
  group: number;
  useAggregate: boolean;
  archiveType?: string;
  nslc?: string;
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
  constructor(private squacApi: SquacApiService) {}

  // gets data from squac, returns measurements or archives
  getData(
    params: MeasurementParams
  ): Observable<ReadAggregate[] | ReadMeasurement[] | ReadArchive[]> {
    let path;
    if (params.archiveType && params.archiveType !== "raw") {
      path = params.archiveType + "-archives/";
    } else if (params.useAggregate) {
      path = "aggregated/";
    } else {
      path = "measurements/";
    }

    return this.squacApi.get(this.url + path, null, {
      metric: params.metricString,
      nslc: params.nslc,
      starttime: params.starttime,
      endtime: params.endtime,
    });
  }

  // Get measurement aggregate from squac
  getAggregated(params: MeasurementHttpData): Observable<ReadAggregate[]> {
    return this.squacApi.get(this.url + "aggregated", null, params);
  }
}
