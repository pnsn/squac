import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { LoadingService } from "@core/services/loading.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Widget } from "./models/widget";
import { WidgetService } from "./services/widget.service";

@Injectable({
  providedIn: "root",
})
export class WidgetResolver implements Resolve<Observable<any>> {
  constructor(
    private widgetService: WidgetService,
    private loadingService: LoadingService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<Widget> | Observable<Widget[]> | Observable<any> {
    const dashboardId = +route.parent.paramMap.get("dashboardId");
    const widgetId = +route.paramMap.get("widgetId");
    this.loadingService.setStatus("Loading widgets");

    if (widgetId) {
      console.log("resolver", widgetId);
      return this.widgetService.getWidget(widgetId).pipe(
        catchError((error) => {
          return this.handleError(error);
        })
      );
    } else if (dashboardId) {
      return this.widgetService.getWidgets(dashboardId).pipe(
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

  handleError(error): Observable<any> {
    console.log("widget error", error);
    // TODO: route to show error
    return of({ error });
  }
}
