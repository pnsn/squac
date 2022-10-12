import { Injectable } from "@angular/core";
import { ReadWriteDeleteApiService } from "@core/models/generic-api-service";
import {
  ApiService,
  DashboardWidgetsCreateRequestParams,
  DashboardWidgetsDeleteRequestParams,
  DashboardWidgetsListRequestParams,
  DashboardWidgetsReadRequestParams,
  DashboardWidgetsUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Widget, WidgetAdapter } from "@widget/models/widget";

@Injectable({
  providedIn: "root",
})
// Class for widget interaction with squac
export class WidgetService extends ReadWriteDeleteApiService<Widget> {
  constructor(widgetAdapter: WidgetAdapter, private api: ApiService) {
    super(widgetAdapter);
  }

  protected apiList = (params: DashboardWidgetsListRequestParams) =>
    this.api.dashboardWidgetsList(params);
  protected apiRead = (params: DashboardWidgetsReadRequestParams) =>
    this.api.dashboardWidgetsRead(params);
  protected apiCreate = (params: DashboardWidgetsCreateRequestParams) =>
    this.api.dashboardWidgetsCreate(params);
  protected apiUpdate = (params: DashboardWidgetsUpdateRequestParams) =>
    this.api.dashboardWidgetsUpdate(params);
  protected apiDelete = (params: DashboardWidgetsDeleteRequestParams) =>
    this.api.dashboardWidgetsDelete(params);
}
