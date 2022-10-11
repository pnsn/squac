import { Injectable } from "@angular/core";
import { Dashboard, DashboardAdapter } from "@dashboard/models/dashboard";
import { Observable, of } from "rxjs";
import { SquacApiService } from "@core/services/squacapi.service";
import { map, tap } from "rxjs/operators";
import { Params } from "@angular/router";
import {
  ApiService,
  DashboardDashboardsCreateRequestParams,
  DashboardDashboardsDeleteRequestParams,
  DashboardDashboardsListRequestParams,
  DashboardDashboardsReadRequestParams,
  DashboardDashboardsUpdateRequestParams,
  ReadOnlyDashboardSerializer,
} from "@pnsn/ngx-squacapi-client";
import { GenericApiService } from "@core/models/generic-api-service";

@Injectable({
  providedIn: "root",
})
export class DashboardService implements GenericApiService<Dashboard> {
  constructor(
    private api: ApiService,
    private dashboardAdapter: DashboardAdapter
  ) {}

  list(params?: DashboardDashboardsListRequestParams): Observable<Dashboard[]> {
    return this.api.dashboardDashboardsList(params).pipe(
      map((response: ReadOnlyDashboardSerializer[]) => {
        return response.map(this.dashboardAdapter.adaptFromApi);
      })
    );
  }

  // Gets channel group with id from server
  read(id: number): Observable<Dashboard> {
    const params: DashboardDashboardsReadRequestParams = {
      id: `${id}`,
    };
    return this.api
      .nslcGroupsRead(params)
      .pipe(map(this.dashboardAdapter.adaptFromApi));
  }

  updateOrCreate(dashboard: Dashboard): Observable<Dashboard> {
    if (dashboard.id) {
      return this.update(dashboard);
    }
    return this.create(dashboard);
  }

  update(dashboard: Dashboard): Observable<Dashboard> {
    const params: DashboardDashboardsUpdateRequestParams = {
      id: `${dashboard.id}`,
      data: this.dashboardAdapter.adaptToApi(dashboard),
    };
    return this.api
      .dashboardDashboardsUpdate(params)
      .pipe(map(this.dashboardAdapter.adaptFromApi));
  }

  create(dashboard: Dashboard): Observable<Dashboard> {
    const params: DashboardDashboardsCreateRequestParams = {
      data: this.dashboardAdapter.adaptToApi(dashboard),
    };
    return this.api
      .dashboardDashboardsCreate(params)
      .pipe(map(this.dashboardAdapter.adaptFromApi));
  }

  delete(id: number): Observable<any> {
    const params: DashboardDashboardsDeleteRequestParams = {
      id: `${id}`,
    };
    return this.api.dashboardDashboardsDelete(params);
  }
}
