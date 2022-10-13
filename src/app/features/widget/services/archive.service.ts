import { Injectable } from "@angular/core";
import { GenericApiService } from "@core/models/generic-api-service";
import { ReadArchive } from "@core/models/squac-types";
import {
  ApiService,
  MeasurementDayArchivesListRequestParams,
  MeasurementHourArchivesListRequestParams,
  MeasurementMonthArchivesListRequestParams,
  MeasurementWeekArchivesListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { map, Observable } from "rxjs";
import { Archive, ArchiveAdapter } from "../models/archive";

export type ArchiveParams =
  | MeasurementDayArchivesListRequestParams
  | MeasurementHourArchivesListRequestParams
  | MeasurementWeekArchivesListRequestParams
  | MeasurementMonthArchivesListRequestParams;

@Injectable({
  providedIn: "root",
})
export class ArchiveService implements GenericApiService<Archive> {
  constructor(private adapter: ArchiveAdapter, private api: ApiService) {}

  list(params: {
    type: string;
    stat: string;
    params: ArchiveParams;
  }): Observable<Archive[]> {
    return this.listArchiveType(params.type, params.params).pipe(
      map((r) => r.map((a) => this.adapter.adaptFromApi(a, params.stat)))
    );
  }

  private listArchiveType(
    type: string,
    params: ArchiveParams
  ): Observable<ReadArchive[]> {
    switch (type) {
      case "hour":
        return this.api.measurementHourArchivesList(params);

      case "day":
        return this.api.measurementDayArchivesList(params);

      case "week":
        return this.api.measurementWeekArchivesList(params);

      case "month":
        return this.api.measurementMonthArchivesList(params);

      default:
        break;
    }
  }
}
