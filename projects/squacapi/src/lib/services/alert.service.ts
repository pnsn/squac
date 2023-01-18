import { Injectable } from "@angular/core";
import { ReadOnlyApiService } from "../interfaces";
import { BaseReadOnlyApiService } from "./generic-api.service";
import { Alert } from "../models";
import {
  ApiService,
  MeasurementAlertsListRequestParams,
  ReadOnlyAlertDetailSerializer,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { ApiEndpoint } from "../enums";

/**
 * Service for requesting alerts from squacapi
 */
@Injectable({
  providedIn: "root",
})
export class AlertService extends BaseReadOnlyApiService<Alert> {
  constructor(override api: ApiService) {
    super(ApiEndpoint.ALERT, api);
  }

  /**
   *
   * @param data
   */
  deserialize(data: ReadOnlyAlertDetailSerializer): Alert {
    return Alert.deserialize(data);
  }
}

export interface AlertService extends ReadOnlyApiService<Alert> {
  read(id: number, refresh?: boolean): Observable<Alert>;
  list(
    params?: MeasurementAlertsListRequestParams,
    refresh?: boolean
  ): Observable<Alert[]>;
}
