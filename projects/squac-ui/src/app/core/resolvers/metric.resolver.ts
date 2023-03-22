import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { LoadingService } from "@core/services/loading.service";
import { Observable } from "rxjs";
import { Metric, MetricService } from "squacapi";

/**
 * Resolve metrics or list of metrics
 */
@Injectable({
  providedIn: "root",
})
export class MetricResolver implements Resolve<Observable<Metric | Metric[]>> {
  constructor(
    private metricService: MetricService,
    private loadingService: LoadingService
  ) {}

  /**
   * REsolve metric of list of metrics
   *
   * @param route activated route
   * @returns observable of results
   */
  resolve(route: ActivatedRouteSnapshot): Observable<Metric | Metric[]> {
    const id = route.paramMap.get("metricId");
    const delay = 500;
    let req;
    if (id) {
      req = this.metricService.read(+id);
    } else {
      req = this.metricService.list();
    }
    return this.loadingService.doLoading(req, null, null, delay);
  }
}
