import { Injectable } from "@angular/core";
import { ReadOnlyApiService } from "../interfaces";
import { BaseApiService } from "./generic-api.service";
import { Alert, AlertAdapter } from "../models";
import {
  ApiService,
  MeasurementAlertsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { ApiEndpoint } from "../enums";

/**
 * Service for requesting alerts from squacapi
 */
@Injectable({
  providedIn: "root",
})
export class AlertService extends BaseApiService<Alert> {
  constructor(override adapter: AlertAdapter, override api: ApiService) {
    super(ApiEndpoint.ALERT, api);
  }
}

export interface AlertService extends ReadOnlyApiService<Alert> {
  read(id: number, refresh?: boolean): Observable<Alert>;
  list(
    params?: MeasurementAlertsListRequestParams,
    refresh?: boolean
  ): Observable<Alert[]>;
}
