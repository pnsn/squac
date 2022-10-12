import { Injectable } from "@angular/core";
import { Params } from "@angular/router";
import { SquacApiService } from "@core/services/squacapi.service";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Alert, AlertAdapter } from "@monitor/models/alert";
import { ReadApiService } from "@core/models/generic-api-service";
import {
  ApiService,
  MeasurementAlertsListRequestParams,
  MeasurementAlertsReadRequestParams,
  ReadOnlyAlertDetailSerializer,
} from "@pnsn/ngx-squacapi-client";

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
