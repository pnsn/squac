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

@Injectable({
  providedIn: "root",
})
export class AlertService
  extends BaseApiService<Alert>
  implements ReadOnlyApiService<Alert>
{
  constructor(override adapter: AlertAdapter, override api: ApiService) {
    super(ApiEndpoint.ALERT, api);
  }

  override read(id: number, refresh?: boolean): Observable<Alert> {
    return super.read(id, refresh);
  }

  list(
    params?: MeasurementAlertsListRequestParams,
    refresh?: boolean
  ): Observable<Alert[]> {
    return super._list(params, { refresh });
  }
}
