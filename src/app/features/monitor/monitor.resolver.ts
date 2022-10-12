import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
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
    const id = +route.paramMap.get("monitorId");
    if (id) {
      return this.monitorService.read(id).pipe(
        catchError((error) => {
          this.messageService.error("Could not load monitor.");
          return this.handleError(error);
        })
      );
    } else {
      return this.monitorService.list().pipe(
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
