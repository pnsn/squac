import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRoute,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { WidgetsService } from "./services/widgets.service";
import { StatTypeService } from "./services/stattype.service";

@Injectable({
  providedIn: "root",
})
export class StatTypeResolver implements Resolve<Observable<any>> {
  constructor(private statTypeService: StatTypeService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.statTypeService.getStatTypes();
  }

  handleError(error): Observable<any> {
    // TODO: route to show error
    return of({ error });
  }
}
