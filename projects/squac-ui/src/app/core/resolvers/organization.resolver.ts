import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { OrganizationService } from "squacapi";

@Injectable({
  providedIn: "root",
})
export class OrganizationResolver implements Resolve<Observable<any>> {
  constructor(private orgService: OrganizationService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = +route.paramMap.get("orgId");
    if (id) {
      return this.orgService.read(id).pipe(
        catchError((error) => {
          return this.handleError(error);
        })
      );
    } else {
      return this.orgService.list().pipe(
        catchError((error) => {
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
