import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Widget } from "@widget/models/widget";
import { SquacApiService } from "@core/services/squacapi.service";
import { ApiGetAggregate } from "@widget/models/aggregate";

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
    widget: Widget,
    useAggregate: boolean,
    archiveType?: string
  ) {
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
}
