import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Widget } from "widgets";
import { WidgetService } from "squacapi";

@Injectable({
  providedIn: "root",
})
export class WidgetResolver implements Resolve<Observable<any>> {
  constructor(private widgetService: WidgetService) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<Widget> | Observable<Widget[]> | Observable<any> {
    const dashboardId = route.paramMap.get("dashboardId");
    const widgetId = route.paramMap.get("widgetId");

    if (widgetId) {
      return this.widgetService.read(+widgetId).pipe(
        catchError((error) => {
          return this.handleError(error);
        })
      );
    } else if (dashboardId) {
      return this.widgetService.list({ dashboard: `${dashboardId}` }).pipe(
        catchError((error) => {
          return this.handleError(error);
        })
      );
      // return all of them
    } else {
      return of({
        error: "Could not load dashboard widgets.",
      });
    }
  }

  handleError(error: unknown): Observable<any> {
    console.error("widget error ", error);
    // TODO: route to show error
    return of({ error });
  }
}
