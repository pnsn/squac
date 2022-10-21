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

@Injectable({
  providedIn: "root",
})
export class HourArchiveService
  extends BaseApiService<Archive>
  implements ListService<Archive>
{
  constructor(protected adapter: ArchiveAdapter, protected api: ApiService) {
    super("measurementHourArchives", api);
  }

  list(
    params: MeasurementHourArchivesListRequestParams
  ): Observable<Archive[]> {
    return super._list(params);
  }
}

@Injectable({
  providedIn: "root",
})
export class DayArchiveService
  extends BaseApiService<Archive>
  implements ListService<Archive>
{
  constructor(protected adapter: ArchiveAdapter, protected api: ApiService) {
    super("measurementDayArchives", api);
  }

  list(params: MeasurementDayArchivesListRequestParams): Observable<Archive[]> {
    return super._list(params);
  }
}

@Injectable({
  providedIn: "root",
})
export class WeekArchiveService
  extends BaseApiService<Archive>
  implements ListService<Archive>
{
  constructor(protected adapter: ArchiveAdapter, protected api: ApiService) {
    super("measurementWeekArchives", api);
  }

  list(
    params: MeasurementWeekArchivesListRequestParams
  ): Observable<Archive[]> {
    return super._list(params);
  }
}

@Injectable({
  providedIn: "root",
})
export class MonthArchiveService
  extends BaseApiService<Archive>
  implements ListService<Archive>
{
  constructor(protected adapter: ArchiveAdapter, protected api: ApiService) {
    super("measurementMonthArchives", api);
  }

  list(
    params: MeasurementMonthArchivesListRequestParams
  ): Observable<Archive[]> {
    return super._list(params);
  }
}
