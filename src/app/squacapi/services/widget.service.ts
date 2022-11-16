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
  constructor(protected adapter: WidgetAdapter, protected api: ApiService) {
    super(ApiEndpoint.WIDGET, api);
  }

  // widget is weird and uses number ids unlike other endpoints
  readParams(id: number): DashboardWidgetsReadRequestParams {
    return { id };
  }

  deleteParams(id: number): DashboardWidgetsDeleteRequestParams {
    return { id };
  }

  updateParams(w: Widget): DashboardWidgetsUpdateRequestParams {
    return {
      id: w.id,
      data: this.adapter.adaptToApi(w),
    };
  }

  read(id: number, refresh?: boolean): Observable<Widget> {
    return super.read(id, { refresh });
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

  delete(id: number): Observable<any> {
    return super.delete(id);
  }
}
