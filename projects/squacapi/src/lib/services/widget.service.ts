import { Injectable } from "@angular/core";
import { SquacApiService } from "../interfaces";
import { BaseApiService } from "./generic-api.service";
import {
  ApiService,
  DashboardWidgetsDeleteRequestParams,
  DashboardWidgetsListRequestParams,
  DashboardWidgetsReadRequestParams,
  DashboardWidgetsUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Widget, WidgetAdapter } from "../models";
import { Observable } from "rxjs";
import { ApiEndpoint } from "../enums";

/**
 * Service for requesting widget data from squacapi
 */
@Injectable({
  providedIn: "root",
})
export class WidgetService extends BaseApiService<Widget> {
  constructor(override adapter: WidgetAdapter, override api: ApiService) {
    super(ApiEndpoint.WIDGET, api);
  }

  /**
   * @override
   */
  override readParams(id: number): DashboardWidgetsReadRequestParams {
    return { id };
  }

  /**
   * @override
   */
  override deleteParams(id: number): DashboardWidgetsDeleteRequestParams {
    return { id };
  }

  /**
   * @override
   */
  override updateParams(w: Widget): DashboardWidgetsUpdateRequestParams {
    return {
      id: w.id,
      data: this.adapter.adaptToApi(w),
    };
  }
}

export interface WidgetService extends SquacApiService<Widget> {
  read(id: number, refresh?: boolean): Observable<Widget>;
  list(
    params?: DashboardWidgetsListRequestParams,
    refresh?: boolean
  ): Observable<Widget[]>;
  updateOrCreate(t: Widget): Observable<Widget>;
  delete(id: number): Observable<Widget>;
}
