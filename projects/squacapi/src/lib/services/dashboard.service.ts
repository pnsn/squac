import { Injectable } from "@angular/core";
import { SquacApiService } from "../interfaces";
import { BaseWriteableApiService } from "./generic-api.service";
import { Dashboard } from "../models";
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
export class DashboardService extends BaseWriteableApiService<Dashboard> {
  constructor(override api: ApiService) {
    super(ApiEndpoint.DASHBOARD, api);
  }
}

export interface DashboardService extends SquacApiService<Dashboard> {
  read(id: number, refresh?: boolean): Observable<Dashboard>;
  list(
    params?: DashboardDashboardsListRequestParams,
    refresh?: boolean
  ): Observable<Dashboard[]>;
  updateOrCreate(d: Dashboard): Observable<number>;
  delete(id: number): Observable<any>;
  updateOrDelete(groups: Dashboard[], ids: number[]): Observable<number>[];
}
