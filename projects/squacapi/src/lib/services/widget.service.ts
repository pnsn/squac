import { Injectable } from "@angular/core";
import { PartialUpdateService, SquacApiService } from "../interfaces";
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

export interface WidgetService
  extends SquacApiService<Widget>,
    PartialUpdateService<Widget> {
  read(id: number, refresh?: boolean): Observable<Widget>;
  list(
    params?: DashboardWidgetsListRequestParams,
    refresh?: boolean
  ): Observable<Widget[]>;
  updateOrCreate(t: Widget): Observable<number>;
  delete(id: number): Observable<any>;
  updateOrDelete(t: Widget[], ids: number[]): Observable<number>[];
  partialUpdate(
    t: Partial<Widget>,
    keys: string[],
    mapId?: boolean
  ): Observable<number | Widget>;
}
