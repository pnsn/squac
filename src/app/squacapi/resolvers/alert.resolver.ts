import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { DateService } from "@core/services/date.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Alert } from "../models/alert";
import { AlertService } from "../services/alert.service";

@Injectable({
  providedIn: "root",
})
export class AlertResolver implements Resolve<Observable<any>> {
  constructor(
    private alertService: AlertService,
    private dateService: DateService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<Alert> | Observable<Alert[]> {
    const id = +route.paramMap.get("alertId");
    if (id) {
      return this.alertService.read(id).pipe(
        catchError((error) => {
          return this.handleError(error);
        })
      );
    } else {
      const lastday = this.dateService.subtractFromNow(1, "day").format();
      return this.alertService.list({ timestampGte: lastday }).pipe(
        catchError((error) => {
          return this.handleError(error);
        })
      );
      // return all of them
    }
  }

  handleError(error): Observable<any> {
    // TODO: route to show error
    return of({ error });
  }
}
