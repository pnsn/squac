import { Injectable } from "@angular/core";
import { ReadApiService } from "@core/models/generic-api-service";
import { Alert, AlertAdapter } from "@monitor/models/alert";
import {
  ApiService,
  MeasurementAlertsListRequestParams,
  MeasurementAlertsReadRequestParams,
  ReadOnlyAlertDetailSerializer,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AlertService extends ReadApiService<Alert> {
  constructor(alertAdapter: AlertAdapter, private api: ApiService) {
    super(alertAdapter);
  }

  //** @override */
  protected apiList = (
    params: MeasurementAlertsListRequestParams
  ): Observable<Array<ReadOnlyAlertDetailSerializer>> => {
    return this.api.measurementAlertsList(params);
  };

  protected apiRead = (
    params: MeasurementAlertsReadRequestParams
  ): Observable<ReadOnlyAlertDetailSerializer> => {
    return this.api.measurementAlertsRead(params);
  };
}
