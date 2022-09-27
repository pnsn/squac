import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { LoadingService } from "@core/services/loading.service";
import { MessageService } from "@core/services/message.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { OrganizationService } from "./services/organization.service";

@Injectable({
  providedIn: "root",
})
export class OrganizationResolver implements Resolve<Observable<any>> {
  constructor(
    private orgService: OrganizationService,
    private loadingService: LoadingService,
    private messageService: MessageService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = +route.paramMap.get("orgId");
    if (id) {
      return this.orgService.getOrganization(id).pipe(
        catchError((error) => {
          this.messageService.error("Could not load organization.");
          return this.handleError(error);
        })
      );
    } else {
      return this.orgService.getOrganizations().pipe(
        catchError((error) => {
          this.messageService.error("Could not load organizations.");
          return this.handleError(error);
        })
      );
    }
  }

  handleError(error): Observable<any> {
    // TODO: route to show error
    return of({ error });
  }
}
