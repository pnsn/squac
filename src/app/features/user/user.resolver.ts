import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { LoadingService } from "@core/services/loading.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { UserService } from "./services/user.service";

@Injectable({
  providedIn: "root",
})
export class UserResolver implements Resolve<Observable<any>> {
  constructor(
    private userService: UserService,
    private loadingService: LoadingService
  ) {}

  resolve(): Observable<any> {
    return this.userService.getUser().pipe(catchError(this.handleError));
  }

  handleError(error): Observable<any> {
    // TODO: route to show error
    return of({ error });
  }
}
