import { Injectable } from "@angular/core";
import { ReadWriteDeleteApiService } from "@core/models/generic-api-service";
import { Dashboard, DashboardAdapter } from "@dashboard/models/dashboard";
import {
  ApiService,
  DashboardDashboardsCreateRequestParams,
  DashboardDashboardsDeleteRequestParams,
  DashboardDashboardsListRequestParams,
  DashboardDashboardsReadRequestParams,
  DashboardDashboardsUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})
export class DashboardService extends ReadWriteDeleteApiService<Dashboard> {
  constructor(private api: ApiService, dashboardAdapter: DashboardAdapter) {
    super(dashboardAdapter);
  }

  protected apiList = (params: DashboardDashboardsListRequestParams) =>
    this.api.dashboardDashboardsList(params);
  protected apiRead = (params: DashboardDashboardsReadRequestParams) =>
    this.api.dashboardDashboardsRead(params);
  protected apiCreate = (params: DashboardDashboardsCreateRequestParams) =>
    this.api.dashboardDashboardsCreate(params);
  protected apiUpdate = (params: DashboardDashboardsUpdateRequestParams) =>
    this.api.dashboardDashboardsUpdate(params);
  protected apiDelete = (params: DashboardDashboardsDeleteRequestParams) =>
    this.api.dashboardDashboardsDelete(params);
}
