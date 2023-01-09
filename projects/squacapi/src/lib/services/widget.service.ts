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
export class WidgetService
  extends BaseApiService<Widget>
  implements SquacApiService<Widget>
{
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

  /**
   * @override
   */
  override read(id: number, refresh?: boolean): Observable<Widget> {
    return super.read(id, refresh);
  }

  /**
   *
   * @param params - squacapi widget request params
   * @param refresh - fresh request, default false
   * @returns array of widgets
   * @override
   */
  list(
    params?: DashboardWidgetsListRequestParams,
    refresh?: boolean
  ): Observable<Widget[]> {
    return super._list(params, { refresh });
  }

  /**
   * @override
   */
  updateOrCreate(t: Widget): Observable<Widget> {
    return super._updateOrCreate(t);
  }

  /**
   * @override
   */
  override delete(id: number): Observable<Widget> {
    return super.delete(id);
  }
}
