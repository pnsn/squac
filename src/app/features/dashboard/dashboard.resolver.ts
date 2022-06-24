import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { DashboardService } from "./services/dashboard.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { LoadingService } from "@core/services/loading.service";
import { MessageService } from "@core/services/message.service";
import { Dashboard } from "./models/dashboard";

export interface DashboardResolved {
  dashboard: Dashboard;
  error?: any;
}

@Injectable({
  providedIn: "root",
})
export class DashboardResolver implements Resolve<Observable<any>> {
  constructor(
    private dashboardService: DashboardService,
    private loadingService: LoadingService,
    private messageService: MessageService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<Dashboard> | Observable<Dashboard[]> {
    const id = +route.paramMap.get("dashboardId");
    if (id) {
      this.loadingService.setStatus("Loading dashboard");
      // get specific resource
      return this.dashboardService.getDashboard(id).pipe(
        catchError((error) => {
          this.messageService.error("Could not load dashboard.");
          return this.handleError(error);
        })
      );
    } else {
      this.loadingService.setStatus("Loading dashboards");
      return this.dashboardService.getDashboards().pipe(
        catchError((error) => {
          this.messageService.error("Could not load dashboards.");
          return this.handleError(error);
        })
      );
      // return all of them
    }
  }

  handleError(error): Observable<any> {
    return of({ error });
  }
}
