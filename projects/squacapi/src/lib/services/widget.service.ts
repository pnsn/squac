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

@Injectable({
  providedIn: "root",
})
// Class for widget interaction with squac
export class WidgetService
  extends BaseApiService<Widget>
  implements SquacApiService<Widget>
{
  constructor(override adapter: WidgetAdapter, override api: ApiService) {
    super(ApiEndpoint.WIDGET, api);
  }

  // widget is weird and uses number ids unlike other endpoints
  override readParams(id: number): DashboardWidgetsReadRequestParams {
    return { id };
  }

  override deleteParams(id: number): DashboardWidgetsDeleteRequestParams {
    return { id };
  }

  override updateParams(w: Widget): DashboardWidgetsUpdateRequestParams {
    return {
      id: w.id,
      data: this.adapter.adaptToApi(w),
    };
  }

  override read(id: number, refresh?: boolean): Observable<Widget> {
    return super.read(id, refresh);
  }

  list(
    params?: DashboardWidgetsListRequestParams,
    refresh?: boolean
  ): Observable<Widget[]> {
    return super._list(params, { refresh });
  }

  updateOrCreate(t: Widget): Observable<Widget> {
    return super._updateOrCreate(t);
  }

  override delete(id: number): Observable<Widget> {
    return super.delete(id);
  }
}
