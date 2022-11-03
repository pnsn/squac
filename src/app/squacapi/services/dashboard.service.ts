import { Injectable } from "@angular/core";
import { SquacApiService } from "../interfaces/api-service.interface";
import { BaseApiService } from "./generic-api.service";
import { Dashboard, DashboardAdapter } from "../models/dashboard";
import {
  ApiService,
  DashboardDashboardsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { ApiEndpoints } from "@squacapi/interfaces/api.interface";

@Injectable({
  providedIn: "root",
})
export class DashboardService
  extends BaseApiService<Dashboard>
  implements SquacApiService<Dashboard>
{
  constructor(protected api: ApiService, protected adapter: DashboardAdapter) {
    super(ApiEndpoints.DASHBOARD, api);
  }

  read(id: number, refresh?: boolean): Observable<Dashboard> {
    return super.read(id, { refresh });
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

  delete(id: number): Observable<any> {
    return super.delete(id);
  }
}
