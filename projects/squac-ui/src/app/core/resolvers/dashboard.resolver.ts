import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { DashboardService } from "squacapi";
import { Observable } from "rxjs";
import { Dashboard } from "squacapi";
import { LoadingService } from "@core/services/loading.service";

/**
 * Resolves a dashboard or list of dashboards
 */
@Injectable({
  providedIn: "root",
})
export class DashboardResolver
  implements Resolve<Observable<Dashboard | Dashboard[]>>
{
  constructor(
    private dashboardService: DashboardService,
    private loadingService: LoadingService
  ) {}

  /**
   * Resolve a dashboard or list of dashboards
   *
   * @param route activated route
   * @returns observable of results
   */
  resolve(route: ActivatedRouteSnapshot): Observable<Dashboard | Dashboard[]> {
    const id = route.paramMap.get("dashboardId");
    const delay = 500;
    let req;
    if (id) {
      req = this.dashboardService.read(+id);
    } else {
      req = this.dashboardService.list();
    }
    return this.loadingService.doLoading(req, null, null, delay);
  }
}
