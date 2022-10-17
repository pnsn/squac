import { Injectable } from "@angular/core";
import { ReadWriteDeleteApiService } from "../interfaces/generic-api-service";
import { Dashboard, DashboardAdapter } from "../models/dashboard";
import { ApiService } from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})
export class DashboardService extends ReadWriteDeleteApiService<Dashboard> {
  constructor(protected api: ApiService, protected adapter: DashboardAdapter) {
    super("dashboardDashboards", api);
  }
}
