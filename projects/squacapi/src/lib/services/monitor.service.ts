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
 *
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
   *
   * @param id
   * @param refresh
   */
  override read(id: number, refresh?: boolean): Observable<Monitor> {
    return super.read(id, refresh);
  }
  /**
   *
   * @param params
   * @param refresh
   */
  list(
    params?: MeasurementMonitorsListRequestParams,
    refresh?: boolean
  ): Observable<Monitor[]> {
    return super._list(params, { refresh });
  }
  /**
   *
   * @param t
   */
  updateOrCreate(t: Monitor): Observable<Monitor> {
    return super._updateOrCreate(t);
  }
  /**
   *
   * @param id
   */
  override delete(id: number): Observable<Monitor> {
    return super.delete(id);
  }
}
