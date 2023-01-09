import { Injectable } from "@angular/core";
import { ListService } from "../interfaces";
import { BaseApiService } from "./generic-api.service";
import {
  ApiService,
  MeasurementDayArchivesListRequestParams,
  MeasurementHourArchivesListRequestParams,
  MeasurementMonthArchivesListRequestParams,
  MeasurementWeekArchivesListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { Archive, ArchiveAdapter } from "../models";
import { ApiEndpoint } from "../enums";

/**
 *
 */
@Injectable({
  providedIn: "root",
})
export class HourArchiveService
  extends BaseApiService<Archive>
  implements ListService<Archive>
{
  constructor(override adapter: ArchiveAdapter, override api: ApiService) {
    super(ApiEndpoint.HOUR_ARCHIVE, api);
  }

  /**
   *
   * @param params
   * @param refresh
   */
  list(
    params: MeasurementHourArchivesListRequestParams,
    refresh?: boolean
  ): Observable<Archive[]> {
    return super._list(params, { refresh });
  }
}

/**
 *
 */
@Injectable({
  providedIn: "root",
})
export class DayArchiveService
  extends BaseApiService<Archive>
  implements ListService<Archive>
{
  constructor(override adapter: ArchiveAdapter, override api: ApiService) {
    super(ApiEndpoint.DAY_ARCHIVE, api);
  }

  /**
   *
   * @param params
   * @param refresh
   */
  list(
    params: MeasurementDayArchivesListRequestParams,
    refresh?: boolean
  ): Observable<Archive[]> {
    return super._list(params, { refresh });
  }
}

/**
 *
 */
@Injectable({
  providedIn: "root",
})
export class WeekArchiveService
  extends BaseApiService<Archive>
  implements ListService<Archive>
{
  constructor(override adapter: ArchiveAdapter, override api: ApiService) {
    super(ApiEndpoint.WEEK_ARCHIVE, api);
  }

  /**
   *
   * @param params
   * @param refresh
   */
  list(
    params: MeasurementWeekArchivesListRequestParams,
    refresh?: boolean
  ): Observable<Archive[]> {
    return super._list(params, { refresh });
  }
}

/**
 *
 */
@Injectable({
  providedIn: "root",
})
export class MonthArchiveService
  extends BaseApiService<Archive>
  implements ListService<Archive>
{
  constructor(override adapter: ArchiveAdapter, override api: ApiService) {
    super(ApiEndpoint.MONTH_ARCHIVE, api);
  }

  /**
   *
   * @param params
   * @param refresh
   */
  list(
    params: MeasurementMonthArchivesListRequestParams,
    refresh?: boolean
  ): Observable<Archive[]> {
    return super._list(params, { refresh });
  }
}
