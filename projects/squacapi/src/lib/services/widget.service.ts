import { Injectable } from "@angular/core";
import { SquacApiService } from "../interfaces";
import { BaseWriteableApiService } from "./generic-api.service";
import {
  ApiService,
  DashboardWidgetsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Widget } from "../models";
import { Observable } from "rxjs";
import { ApiEndpoint } from "../enums";

/**
 * Service for requesting widget data from squacapi
 */
@Injectable({
  providedIn: "root",
})
export class WidgetService extends BaseWriteableApiService<Widget> {
  constructor(override api: ApiService) {
    super(ApiEndpoint.WIDGET, api);
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
