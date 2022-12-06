import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { MetricService } from "squacapi";

@Injectable({
  providedIn: "root",
})
export class MetricResolver implements Resolve<Observable<any>> {
  constructor(private metricService: MetricService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = route.paramMap.get("metricId");
    if (id) {
      return this.metricService.read(+id).pipe(catchError(this.handleError));
    } else {
      return this.metricService.list().pipe(catchError(this.handleError));
      // return all of them
    }
  }

  handleError(error: unknown): Observable<any> {
    // TODO: route to show error
    return of({ error });
  }
}
