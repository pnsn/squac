import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { DashboardService } from "../services/dashboard.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Dashboard } from "../models/dashboard";

export interface DashboardResolved {
  dashboard: Dashboard;
  error?: any;
}

@Injectable({
  providedIn: "root",
})
export class DashboardResolver implements Resolve<Observable<any>> {
  constructor(private dashboardService: DashboardService) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<Dashboard> | Observable<Dashboard[]> {
    const id = +route.paramMap.get("dashboardId");
    if (id) {
      return this.dashboardService.read(id).pipe(catchError(this.handleError));
    } else {
      return this.dashboardService.list().pipe(catchError(this.handleError));
      // return all of them
    }
  }

  handleError(error): Observable<any> {
    return of({ error });
  }
}
