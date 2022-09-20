import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { LoadingService } from "@core/services/loading.service";
import { MessageService } from "@core/services/message.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Monitor } from "./models/monitor";
import { MonitorService } from "./services/monitor.service";

@Injectable({
  providedIn: "root",
})
export class MonitorResolver implements Resolve<Observable<any>> {
  constructor(
    private monitorService: MonitorService,
    private loadingService: LoadingService,
    private messageService: MessageService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<Monitor> | Observable<Monitor[]> {
    console.log("resolver called")

    const id = +route.paramMap.get("monitorId");
    if (id) {
      return this.monitorService.getMonitor(id).pipe(
        catchError((error) => {
          this.messageService.error("Could not load monitor.");
          return this.handleError(error);
        })
      );
    } else {
      return this.monitorService.getMonitors().pipe(
        catchError((error) => {
          this.messageService.error("Could not load monitors.");
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
