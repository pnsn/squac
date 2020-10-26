import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { LoadingService } from '@core/services/loading.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from './services/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<Observable<any>> {
  constructor(
    private userService: UserService,
    private loadingService: LoadingService
    ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    this.loadingService.setStatus('Loading user');
    return this.userService.getUser().pipe(
      catchError(this.handleError)
    );
  }

  handleError(error): Observable<any> {
    // TODO: route to show error
    return of({ error });
  }

}
