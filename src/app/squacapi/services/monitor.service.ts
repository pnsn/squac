import { Injectable } from "@angular/core";
import {
  ApiService,
  MeasurementMonitorsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { SquacApiService } from "../interfaces";
import { BaseApiService } from "./generic-api.service";
import { Monitor, MonitorAdapter } from "../models";
import { ApiEndpoint } from "../enums";

@Injectable({
  providedIn: "root",
})
export class MonitorService
  extends BaseApiService<Monitor>
  implements SquacApiService<Monitor>
{
  constructor(protected adapter: MonitorAdapter, protected api: ApiService) {
    super(ApiEndpoint.MONITOR, api);
  }

  read(id: number, refresh?: boolean): Observable<Monitor> {
    return super.read(id, { refresh });
  }
  list(
    params?: MeasurementMonitorsListRequestParams,
    refresh?: boolean
  ): Observable<Monitor[]> {
    return super._list(params, { refresh });
  }
  updateOrCreate(t: Monitor): Observable<Monitor> {
    return super._updateOrCreate(t);
  }
  delete(id: number): Observable<Monitor> {
    return super.delete(id);
  }
}
