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

/**
 * Service for managing dashboards in squacapi
 */
@Injectable({
  providedIn: "root",
})
export class DashboardService extends BaseApiService<Dashboard> {
  constructor(override api: ApiService, override adapter: DashboardAdapter) {
    super(ApiEndpoint.DASHBOARD, api);
  }
}

export interface DashboardService extends SquacApiService<Dashboard> {
  read(id: number, refresh?: boolean): Observable<Dashboard>;
  list(
    params?: DashboardDashboardsListRequestParams,
    refresh?: boolean
  ): Observable<Dashboard[]>;
  updateOrCreate(d: Dashboard): Observable<Dashboard>;
  delete(id: number): Observable<Dashboard>;
}
