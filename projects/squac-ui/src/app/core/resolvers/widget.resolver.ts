import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { Widget } from "widgets";
import { WidgetService } from "squacapi";
import { LoadingService } from "@core/services/loading.service";

/**
 * Resolves widget data
 */
@Injectable({
  providedIn: "root",
})
export class WidgetResolver implements Resolve<Observable<Widget | Widget[]>> {
  constructor(
    private widgetService: WidgetService,
    private loadingService: LoadingService
  ) {}

  /**
   * Resolves a widget or multiple widgets for a dashboard
   *
   * @param route activated route
   * @returns observable of data or error
   */
  resolve(route: ActivatedRouteSnapshot): Observable<Widget | Widget[]> {
    const dashboardId = route.paramMap.get("dashboardId");
    const widgetId = route.paramMap.get("widgetId");
    const delay = 500;
    let req;
    if (widgetId) {
      req = this.widgetService.read(+widgetId);
    } else if (dashboardId) {
      req = this.widgetService.list({ dashboard: `${dashboardId}` });
    }
    return this.loadingService.doLoading(req, null, null, delay);
  }
}
