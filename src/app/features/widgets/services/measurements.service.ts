import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Widget } from "@features/widgets/models/widget";
import { SquacApiService } from "@core/services/squacapi.service";
import {
  ApiGetMeasurement,
  Measurement,
  MeasurementAdapter,
} from "../models/measurement";
import { map } from "rxjs/operators";
import { ApiGetArchive, Archive, ArchiveAdapter } from "../models/archive";
import {
  Aggregate,
  AggregateAdapter,
  ApiGetAggregate,
} from "../models/aggregate";

export class MeasurementHttpData {
  metric: string;
  group: number;
  starttime: string;
  endtime: string;
}
@Injectable({
  providedIn: "root",
})
export class MeasurementsService {
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
    const widgetType = widget.typeId;
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

  // Get measurements from squac
  private getMeasurements(
    starttime: string,
    endtime: string,
    params: MeasurementHttpData
  ): Observable<ApiGetMeasurement[]> {
    return this.squacApi.get(this.url + "measurements", null, params);
  }

  // Get measurement aggregate from squac
  getAggregated(params: MeasurementHttpData): Observable<ApiGetAggregate[]> {
    return this.squacApi.get(this.url + "aggregated", null, params);
  }

  // Get measurement aggregate from squac
  private getArchive(
    starttime: string,
    endtime: string,
    archiveType: string,
    params: MeasurementHttpData
  ): Observable<ApiGetArchive[]> {
    return this.squacApi.get(
      this.url + archiveType + "-archives",
      null,
      params
    );
  }
}
