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

/**
 * Service for managing monitors
 */
@Injectable({
  providedIn: "root",
})
export class MonitorService
  extends BaseApiService<Monitor>
  implements SquacApiService<Monitor>
{
  constructor(override adapter: MonitorAdapter, override api: ApiService) {
    super(ApiEndpoint.MONITOR, api);
  }

  /**
   * @override
   */
  override read(id: number, refresh?: boolean): Observable<Monitor> {
    return super.read(id, refresh);
  }

  /**
   * @override
   */
  list(
    params?: MeasurementMonitorsListRequestParams,
    refresh?: boolean
  ): Observable<Monitor[]> {
    return super._list(params, { refresh });
  }

  /**
   * @override
   */
  updateOrCreate(t: Monitor): Observable<Monitor> {
    return super._updateOrCreate(t);
  }

  /**
   * @override
   */
  override delete(id: number): Observable<Monitor> {
    return super.delete(id);
  }
}
