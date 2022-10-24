import { Injectable } from "@angular/core";
import { ListService } from "../interfaces/api-service.interface";
import { BaseApiService } from "./generic-api.service";
import {
  ApiService,
  MeasurementDayArchivesListRequestParams,
  MeasurementHourArchivesListRequestParams,
  MeasurementMonthArchivesListRequestParams,
  MeasurementWeekArchivesListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { Archive, ArchiveAdapter } from "../models/archive";
import { ApiEndpoints } from "@squacapi/interfaces/api.interface";

@Injectable({
  providedIn: "root",
})
export class HourArchiveService
  extends BaseApiService<Archive>
  implements ListService<Archive>
{
  constructor(protected adapter: ArchiveAdapter, protected api: ApiService) {
    super(ApiEndpoints.HOUR_ARCHIVE, api);
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
    super(ApiEndpoints.DAY_ARCHIVE, api);
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
    super(ApiEndpoints.WEEK_ARCHIVE, api);
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
    super(ApiEndpoints.MONTH_ARCHIVE, api);
  }

  list(
    params: MeasurementMonthArchivesListRequestParams
  ): Observable<Archive[]> {
    return super._list(params);
  }
}
