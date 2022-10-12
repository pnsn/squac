import { Injectable } from "@angular/core";
import { ListApiService } from "@core/models/generic-api-service";
import { Alert, AlertAdapter } from "@monitor/models/alert";
import {
  ApiService,
  MeasurementAlertsListRequestParams,
} from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})
export class AlertService extends ListApiService<Alert> {
  constructor(alertAdapter: AlertAdapter, private api: ApiService) {
    super(alertAdapter);
  }

  //** @override */
  protected apiList = (params: MeasurementAlertsListRequestParams) =>
    this.api.measurementAlertsList(params);
}
