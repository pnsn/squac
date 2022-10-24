import { Injectable } from "@angular/core";
import { SquacApiService } from "../interfaces/api-service.interface";
import { BaseApiService } from "./generic-api.service";
import {
  ApiService,
  DashboardWidgetsDeleteRequestParams,
  DashboardWidgetsListRequestParams,
  DashboardWidgetsReadRequestParams,
  DashboardWidgetsUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Widget, WidgetAdapter } from "../models/widget";
import { Observable } from "rxjs";
import { ApiEndpoints } from "@squacapi/interfaces/api.interface";

@Injectable({
  providedIn: "root",
})
// Class for widget interaction with squac
export class WidgetService
  extends BaseApiService<Widget>
  implements SquacApiService<Widget>
{
  constructor(protected adapter: WidgetAdapter, protected api: ApiService) {
    super(ApiEndpoints.WIDGET, api);
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

  read(id: number): Observable<Widget> {
    return super.read(id);
  }

  list(params?: DashboardWidgetsListRequestParams): Observable<Widget[]> {
    return super._list(params);
  }

  updateOrCreate(t: Widget): Observable<Widget> {
    return super._updateOrCreate(t);
  }

  delete(id: number): Observable<any> {
    return super.delete(id);
  }
}
