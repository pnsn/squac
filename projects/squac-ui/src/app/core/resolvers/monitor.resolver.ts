import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Monitor, MonitorService } from "squacapi";

/**
 *
 */
@Injectable({
  providedIn: "root",
})
export class MonitorResolver implements Resolve<Observable<any>> {
  constructor(private monitorService: MonitorService) {}

  /**
   *
   * @param route
   */
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<Monitor> | Observable<Monitor[]> {
    const id = route.paramMap.get("monitorId");
    if (id) {
      return this.monitorService.read(+id).pipe(
        catchError((error) => {
          return this.handleError(error);
        })
      );
    } else {
      return this.monitorService.list().pipe(
        catchError((error) => {
          return this.handleError(error);
        })
      );
      // return all of them
    }
  }

  /**
   *
   * @param error
   */
  handleError(error: unknown): Observable<any> {
    return of({ error });
  }
}
