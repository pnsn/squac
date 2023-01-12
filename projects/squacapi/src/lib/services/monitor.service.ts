import { Injectable } from "@angular/core";
import {
  ApiService,
  MeasurementMonitorsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { SquacApiService } from "../interfaces";
import { BaseApiService } from "./generic-api.service";
import { Monitor, MonitorAdapter } from "../models";
import { ApiEndpoint } from "../enums";

/**
 * Service for managing monitors
 */
@Injectable({
  providedIn: "root",
})
export class MonitorService extends BaseApiService<Monitor> {
  constructor(override adapter: MonitorAdapter, override api: ApiService) {
    super(ApiEndpoint.MONITOR, api);
  }
}

export interface MonitorService extends SquacApiService<Monitor> {
  read(id: number, refresh?: boolean): Observable<Monitor>;
  list(
    params?: MeasurementMonitorsListRequestParams,
    refresh?: boolean
  ): Observable<Monitor[]>;
  updateOrCreate(t: Monitor): Observable<Monitor>;
  delete(id: number): Observable<Monitor>;
}
