import { Injectable } from "@angular/core";
import { ReadApiService } from "@core/models/generic-api-service";
import { Alert, AlertAdapter } from "@monitor/models/alert";
import {
  ApiService,
  MeasurementAlertsListRequestParams,
  MeasurementAlertsReadRequestParams,
} from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})
export class AlertService extends ReadApiService<Alert> {
  constructor(alertAdapter: AlertAdapter, private api: ApiService) {
    super(alertAdapter);
  }

  //** @override */
  protected apiList = (params: MeasurementAlertsListRequestParams) =>
    this.api.measurementAlertsList(params);

  protected apiRead = (params: MeasurementAlertsReadRequestParams) =>
    this.api.measurementAlertsRead(params);
}
