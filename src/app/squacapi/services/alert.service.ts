import { Injectable } from "@angular/core";
import { ReadOnlyApiService } from "../interfaces/api-service.interface";
import { BaseApiService } from "./generic-api.service";
import { Alert, AlertAdapter } from "../models/alert";
import {
  ApiService,
  MeasurementAlertsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { ApiEndpoints } from "@squacapi/interfaces/api.interface";

@Injectable({
  providedIn: "root",
})
export class AlertService
  extends BaseApiService<Alert>
  implements ReadOnlyApiService<Alert>
{
  constructor(protected adapter: AlertAdapter, protected api: ApiService) {
    super(ApiEndpoints.ALERT, api);
  }

  read(id: number, refresh?: boolean): Observable<Alert> {
    return super.read(id, { refresh });
  }

  list(
    params?: MeasurementAlertsListRequestParams,
    refresh?: boolean
  ): Observable<Alert[]> {
    return super._list(params, { refresh });
  }
}
