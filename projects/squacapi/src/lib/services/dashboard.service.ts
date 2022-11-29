import { Injectable } from "@angular/core";
import { SquacApiService } from "../interfaces";
import { BaseApiService } from "./generic-api.service";
import { Dashboard, DashboardAdapter } from "../models";
import {
  ApiService,
  DashboardDashboardsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { ApiEndpoint } from "../enums";

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

  override read(id: number, refresh?: boolean): Observable<Dashboard> {
    return super.read(id, refresh);
  }

  list(
    params?: DashboardDashboardsListRequestParams,
    refresh?: boolean
  ): Observable<Dashboard[]> {
    return super._list(params, { refresh });
  }

  updateOrCreate(d: Dashboard): Observable<Dashboard> {
    return super._updateOrCreate(d);
  }

  override delete(id: number): Observable<Dashboard> {
    return super.delete(id);
  }
}
