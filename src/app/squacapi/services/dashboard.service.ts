import { Injectable } from "@angular/core";
import {
  BaseApiService,
  SquacApiService,
} from "../interfaces/generic-api-service";
import { Dashboard, DashboardAdapter } from "../models/dashboard";
import {
  ApiService,
  DashboardDashboardsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DashboardService
  extends BaseApiService<Dashboard>
  implements SquacApiService<Dashboard>
{
  constructor(protected api: ApiService, protected adapter: DashboardAdapter) {
    super("dashboardDashboards", api);
  }

  read(id: number): Observable<Dashboard> {
    console.log(`get dashboard ${id}`);
    return super.read(id);
  }

  list(params?: DashboardDashboardsListRequestParams): Observable<Dashboard[]> {
    console.log("request dashboard list");
    return super._list(params);
  }

  updateOrCreate(d: Dashboard): Observable<Dashboard> {
    return super._updateOrCreate(d);
  }

  delete(id: number): Observable<any> {
    return super.delete(id);
  }
}
