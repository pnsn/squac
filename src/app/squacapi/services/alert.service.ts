import { Injectable } from "@angular/core";
import {
  BaseApiService,
  ReadOnlyApiService,
} from "../interfaces/generic-api-service";
import { Alert, AlertAdapter } from "../models/alert";
import {
  ApiService,
  MeasurementAlertsListRequestParams,
  MeasurementAlertsReadRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AlertService
  extends BaseApiService<Alert>
  implements ReadOnlyApiService<Alert>
{
  constructor(protected adapter: AlertAdapter, protected api: ApiService) {
    super("measurementAlerts", api);
  }

  read(id: number): Observable<Alert> {
    return super.read(id);
  }
  list(params?: MeasurementAlertsListRequestParams): Observable<Alert[]> {
    return super._list(params);
  }
}
