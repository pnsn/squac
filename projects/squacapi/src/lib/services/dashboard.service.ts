import { Injectable } from "@angular/core";
import { SquacApiService } from "../interfaces";
import { BaseApiService } from "./generic-api.service";
import { Dashboard, DashboardAdapter } from "../../../models";
import {
  ApiService,
  DashboardDashboardsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { ApiEndpoint } from "../enums";

/**
 *
 */
@Injectable({
  providedIn: "root",
})
export class DashboardService
  extends BaseApiService<Dashboard>
  implements SquacApiService<Dashboard>
{
  constructor(override api: ApiService, override adapter: DashboardAdapter) {
    super(ApiEndpoint.DASHBOARD, api);
  }

  /**
   *
   * @param id
   * @param refresh
   */
  override read(id: number, refresh?: boolean): Observable<Dashboard> {
    return super.read(id, refresh);
  }

  /**
   *
   * @param params
   * @param refresh
   */
  list(
    params?: DashboardDashboardsListRequestParams,
    refresh?: boolean
  ): Observable<Dashboard[]> {
    return super._list(params, { refresh });
  }

  /**
   *
   * @param d
   */
  updateOrCreate(d: Dashboard): Observable<Dashboard> {
    return super._updateOrCreate(d);
  }

  /**
   *
   * @param id
   */
  override delete(id: number): Observable<Dashboard> {
    return super.delete(id);
  }
}
