import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Widget } from "@widget/models/widget";
import { SquacApiService } from "@core/services/squacapi.service";
import { Measurement, MeasurementAdapter } from "@widget/models/measurement";
import { map } from "rxjs/operators";
import { Archive, ArchiveAdapter } from "@widget/models/archive";
import {
  Aggregate,
  AggregateAdapter,
  ApiGetAggregate,
} from "@widget/models/aggregate";

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
    private measurementAdapter: MeasurementAdapter,
    private archiveAdapter: ArchiveAdapter,
    private aggregateAdapter: AggregateAdapter
  ) {}

  // gets data from squac, returns measurements or archives
  getData(
    starttime: string,
    endtime: string,
    widget: Widget,
    archiveType?: string,
    archiveStat?: string
  ) {
    const data = {};
    const params = {
      metric: widget.metricsString,
      group: widget.channelGroup.id,
      starttime,
      endtime,
    };
    let path;
    if (archiveType && archiveType !== "raw") {
      path = archiveType + "-archives/";
    } else if (widget.useAggregate) {
      path = "aggregated/";
    } else {
      path = "measurements/";
    }
    return this.squacApi.get(this.url + path, null, params).pipe(
      map((response) => {
        response.forEach((m) => {
          let value: Measurement | Aggregate | Archive;
          switch (path) {
            case "measurements/":
              value = this.measurementAdapter.adaptFromApi(m);
              break;
            case "aggregated/":
              value = this.aggregateAdapter.adaptFromApi(m);
              break;

            default:
              // archive stat
              value = this.archiveAdapter.adaptFromApi(m);
              if (archiveStat) {
                value.value = value[archiveStat];
              }
              break;
          }

          if (!data[m.channel]) {
            data[m.channel] = {};
          }
          if (!data[m.channel][m.metric]) {
            data[m.channel][m.metric] = [];
          }

          data[m.channel][m.metric].push(value);
        });
        return data;
      })
    );
  }

  // Get measurement aggregate from squac
  getAggregated(params: MeasurementHttpData): Observable<ApiGetAggregate[]> {
    return this.squacApi.get(this.url + "aggregated", null, params);
  }
}