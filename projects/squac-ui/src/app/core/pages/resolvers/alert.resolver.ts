import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import { Observable } from "rxjs";
import { Alert } from "squacapi";
import { AlertService } from "squacapi";
//FIXME: remove import from@core
/**
 * Resolver for single alert or last day of alerts
 */
@Injectable({
  providedIn: "root",
})
export class AlertResolver implements Resolve<Observable<Alert | Alert[]>> {
  constructor(
    private alertService: AlertService,
    private dateService: DateService,
    private loadingService: LoadingService
  ) {}

  /**
   * Resolves a single alert or last day of alerts
   *
   * @param route activated route
   * @returns array of results
   */
  resolve(route: ActivatedRouteSnapshot): Observable<Alert | Alert[]> {
    const id = route.paramMap.get("alertId");
    const delay = 500;
    let req;
    if (id) {
      req = this.alertService.read(+id);
    } else {
      const lastday = this.dateService.subtractFromNow(1, "day").format();
      req = this.alertService.list({ timestampGte: lastday });
    }

    return this.loadingService.doLoading(req, null, null, delay);
  }
}
