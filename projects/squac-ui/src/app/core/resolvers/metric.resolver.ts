import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Metric, MetricService } from "squacapi";

/**
 * Resolve metrics or list of metrics
 */
@Injectable({
  providedIn: "root",
})
export class MetricResolver implements Resolve<Observable<Metric | Metric[]>> {
  constructor(private metricService: MetricService) {}

  /**
   * REsolve metric of list of metrics
   *
   * @param route activated route
   * @returns observable of results
   */
  resolve(route: ActivatedRouteSnapshot): Observable<Metric | Metric[]> {
    const id = route.paramMap.get("metricId");
    if (id) {
      return this.metricService.read(+id);
    } else {
      return this.metricService.list({ order: "name" });
      // return all of them
    }
  }
}
