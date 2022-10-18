import { Injectable } from "@angular/core";
import {
  GenericApiService,
  SquacApiService,
} from "../interfaces/generic-api-service";
import {
  ApiService,
  DashboardWidgetsCreateRequestParams,
  DashboardWidgetsDeleteRequestParams,
  DashboardWidgetsListRequestParams,
  DashboardWidgetsReadRequestParams,
  DashboardWidgetsUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Widget, WidgetAdapter } from "../models/widget";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
// Class for widget interaction with squac
export class WidgetService extends SquacApiService<Widget> {
  constructor(protected adapter: WidgetAdapter, protected api: ApiService) {
    super("dashboardWidgets", api);
  }

  readParams(id: number | string): DashboardWidgetsReadRequestParams {
    return {
      id: +id,
    };
  }

  listParams(params: any): DashboardWidgetsListRequestParams {
    return params;
  }

  updateParams(data: any): DashboardWidgetsUpdateRequestParams {
    return {
      id: +data.id,
      data,
    };
  }

  createParams(data: any): DashboardWidgetsCreateRequestParams {
    return {
      data,
    };
  }

  deleteParams(id: string | number): DashboardWidgetsDeleteRequestParams {
    return {
      id: +id,
    };
  }
}

// const params = {
//   id: `${t.id}`,
//   data: this.adapter.adaptToApi(t),
// };
