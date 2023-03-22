import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { LoadingService } from "@core/services/loading.service";
import { ResolverService } from "@core/services/resolver.service";
import { Observable } from "rxjs";
import { Monitor, MonitorService } from "squacapi";

/**
 * Resolver for monitors
 */
@Injectable({
  providedIn: "root",
})
export class MonitorResolver
  implements Resolve<Observable<Monitor | Monitor[]>>
{
  constructor(
    private monitorService: MonitorService,
    private loadingService: LoadingService
  ) {}

  /**
   * Resolve monitor or list of monitors
   *
   * @param route activated route
   * @returns observable of results
   */
  resolve(route: ActivatedRouteSnapshot): Observable<Monitor | Monitor[]> {
    const id = route.paramMap.get("monitorId");
    const delay = 1000;
    let req;
    if (id) {
      req = this.monitorService.read(+id);
    } else {
      req = this.monitorService.list();
    }
    return this.loadingService.doLoading(req, null, null, delay);
  }
}
