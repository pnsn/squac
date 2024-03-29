import { Injectable } from "@angular/core";
import { ListService } from "../interfaces";
import { BaseReadOnlyApiService } from "./generic-api.service";
import {
  ApiService,
  MeasurementDayArchivesListRequestParams,
  MeasurementHourArchivesListRequestParams,
  MeasurementMonthArchivesListRequestParams,
  MeasurementWeekArchivesListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { Archive } from "../models";
import { ApiEndpoint } from "../enums";

/**
 * Service for requesting archives
 */
@Injectable({
  providedIn: "root",
})
export class HourArchiveService extends BaseReadOnlyApiService<Archive> {
  constructor(override api: ApiService) {
    super(ApiEndpoint.HOUR_ARCHIVE, api);
  }
}

export interface HourArchiveService extends ListService<Archive> {
  list(
    params: MeasurementHourArchivesListRequestParams,
    refresh?: boolean
  ): Observable<Archive[]>;
}

/**
 * Service for requesting day archives
 */
@Injectable({
  providedIn: "root",
})
export class DayArchiveService extends BaseReadOnlyApiService<Archive> {
  constructor(override api: ApiService) {
    super(ApiEndpoint.DAY_ARCHIVE, api);
  }
}
export interface DayArchiveService extends ListService<Archive> {
  list(
    params: MeasurementDayArchivesListRequestParams,
    refresh?: boolean
  ): Observable<Archive[]>;
}

/**
 * Service for requesting week archives
 */
@Injectable({
  providedIn: "root",
})
export class WeekArchiveService extends BaseReadOnlyApiService<Archive> {
  constructor(override api: ApiService) {
    super(ApiEndpoint.WEEK_ARCHIVE, api);
  }
}
export interface WeekArchiveService extends ListService<Archive> {
  list(
    params: MeasurementWeekArchivesListRequestParams,
    refresh?: boolean
  ): Observable<Archive[]>;
}

/**
 * Service for requesting month archives
 */
@Injectable({
  providedIn: "root",
})
export class MonthArchiveService extends BaseReadOnlyApiService<Archive> {
  constructor(override api: ApiService) {
    super(ApiEndpoint.MONTH_ARCHIVE, api);
  }
}

export interface MonthArchiveService extends ListService<Archive> {
  list(
    params: MeasurementMonthArchivesListRequestParams,
    refresh?: boolean
  ): Observable<Archive[]>;
}
