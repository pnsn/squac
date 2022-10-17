import { Injectable } from "@angular/core";
import { ReadWriteDeleteApiService } from "@core/models/generic-api-service";
import { Dashboard, DashboardAdapter } from "@dashboard/models/dashboard";
import { ApiService } from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})
export class DashboardService extends ReadWriteDeleteApiService<Dashboard> {
  constructor(protected api: ApiService, protected adapter: DashboardAdapter) {
    super("dashboardDashboards", api);
  }
}
