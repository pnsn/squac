import { Injectable } from "@angular/core";
import {
  BaseApiService,
  SquacApiService,
} from "../interfaces/generic-api-service";
import { Monitor, MonitorAdapter } from "../models/monitor";
import {
  ApiService,
  MeasurementMonitorsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { ApiEndpoints } from "@squacapi/interfaces/api.interface";

@Injectable({
  providedIn: "root",
})
export class MonitorService
  extends BaseApiService<Monitor>
  implements SquacApiService<Monitor>
{
  constructor(protected adapter: MonitorAdapter, protected api: ApiService) {
    super(ApiEndpoints.MONITOR, api);
  }

  read(id: number): Observable<Monitor> {
    return super.read(id);
  }
  list(params?: MeasurementMonitorsListRequestParams): Observable<Monitor[]> {
    return super._list(params);
  }
  updateOrCreate(t: Monitor): Observable<Monitor> {
    return super._updateOrCreate(t);
  }
  delete(id: number): Observable<Monitor> {
    return super.delete(id);
  }
}
