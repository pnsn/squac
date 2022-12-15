import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable, of } from "rxjs";
import { Widget } from "widgets";
import { WidgetService } from "squacapi";

type WidgetResolverResponses = Widget | Widget[] | any;
/**
 * Resolves widget data
 */
@Injectable({
  providedIn: "root",
})
export class WidgetResolver
  implements Resolve<Observable<WidgetResolverResponses>>
{
  constructor(private widgetService: WidgetService) {}

  /**
   * Resolves a widget or multiple widgets for a dashboard
   *
   * @param route activated route
   * @returns observable of data or error
   */
  resolve(route: ActivatedRouteSnapshot): Observable<WidgetResolverResponses> {
    const dashboardId = route.paramMap.get("dashboardId");
    const widgetId = route.paramMap.get("widgetId");

    if (widgetId) {
      return this.widgetService.read(+widgetId);
    } else if (dashboardId) {
      return this.widgetService.list({ dashboard: `${dashboardId}` });
    } else {
      return of({
        error: "Could not load dashboard widgets.",
      });
    }
  }
}
