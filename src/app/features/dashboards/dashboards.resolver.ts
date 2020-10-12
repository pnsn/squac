import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { DashboardsService } from './services/dashboards.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardsResolver implements Resolve<Observable<any>> {
  constructor(private dashboardsService: DashboardsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = +route.paramMap.get('id');

    if (id) {
      // get specific resource
      console.log('dashboard id', id);
      return this.dashboardsService.getDashboard(id).pipe(
        tap(data => {
          console.log('in resolver, dashboard');
        }),
        catchError(this.handleError)
      );
    } else {
      return this.dashboardsService.getDashboards().pipe(
        tap(data => {
          console.log('in resolver, dashboards');
        }),
        catchError(this.handleError)
      );
      // return all of them
    }

  }

  handleError(error): Observable<any> {
    // TODO: route to show error
    return of({ error });
  }

}
