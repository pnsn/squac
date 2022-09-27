import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { DashboardService } from "./services/dashboard.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
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
    private messageService: MessageService
  ) {}

  resolve(): Observable<Dashboard> | Observable<Dashboard[]> {
    return this.dashboardService.getDashboards().pipe(
      catchError((error) => {
        this.messageService.error("Could not load dashboards.");
        return this.handleError(error);
      })
    );
    // return all of them
  }

  handleError(error): Observable<any> {
    return of({ error });
  }
}
