import { Injectable } from "@angular/core";
import {
  BaseApiService,
  SquacApiService,
} from "../interfaces/generic-api-service";
import { Monitor, MonitorAdapter } from "../models/monitor";
import {
  ApiService,
  MeasurementMonitorsDeleteRequestParams,
  MeasurementMonitorsListRequestParams,
  MeasurementMonitorsReadRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MonitorService
  extends BaseApiService<Monitor>
  implements SquacApiService<Monitor>
{
  constructor(protected adapter: MonitorAdapter, protected api: ApiService) {
    super("measurementMonitors", api);
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
