import { Injectable } from "@angular/core";
import { BaseApiService, ListService } from "../interfaces/generic-api-service";
import {
  ApiService,
  MeasurementDayArchivesListRequestParams,
  MeasurementHourArchivesListRequestParams,
  MeasurementMonthArchivesListRequestParams,
  MeasurementWeekArchivesListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { map, Observable } from "rxjs";
import { Archive, ArchiveAdapter } from "../models/archive";
import { titleCaseWord } from "@squacapi/utils/utils";

export type ArchiveParams =
  | MeasurementDayArchivesListRequestParams
  | MeasurementHourArchivesListRequestParams
  | MeasurementWeekArchivesListRequestParams
  | MeasurementMonthArchivesListRequestParams;

@Injectable({
  providedIn: "root",
})
export class ArchiveService
  extends BaseApiService<Archive>
  implements ListService<Archive>
{
  constructor(protected adapter: ArchiveAdapter, protected api: ApiService) {
    super("measurement", api);
  }

  list(params: {
    type: string;
    stat: string;
    params: ArchiveParams;
  }): Observable<Archive[]> {
    const type = titleCaseWord(params.type);
    return this.api[`measurement${type}ArchivesList`](params.params).pipe(
      map((r: Array<any>) =>
        r.map((a) => this.adapter.adaptFromApi(a, params.stat))
      )
    );
  }
}
