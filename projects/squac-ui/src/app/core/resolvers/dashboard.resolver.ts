import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { DashboardService } from "squacapi";
import { Observable } from "rxjs";
import { Dashboard } from "squacapi";

/**
 * Resolves a dashboard or list of dashboards
 */
@Injectable({
  providedIn: "root",
})
export class DashboardResolver
  implements Resolve<Observable<Dashboard | Dashboard[]>>
{
  constructor(private dashboardService: DashboardService) {}

  /**
   * Resolve a dashboard or list of dashboards
   *
   * @param route activated route
   * @returns observable of results
   */
  resolve(route: ActivatedRouteSnapshot): Observable<Dashboard | Dashboard[]> {
    const id = route.paramMap.get("dashboardId");
    if (id) {
      return this.dashboardService.read(+id);
    } else {
      return this.dashboardService.list();
      // return all of them
    }
  }
}
