import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
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

  resolve(): Observable<Dashboard> | Observable<Dashboard[]> {
    return this.dashboardService.list().pipe(
      catchError((error) => {
        return this.handleError(error);
      })
    );
    // return all of them
  }

  handleError(error): Observable<any> {
    return of({ error });
  }
}
