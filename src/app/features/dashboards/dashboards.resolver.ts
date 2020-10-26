import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { DashboardsService } from './services/dashboards.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoadingService } from '@core/services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardsResolver implements Resolve<Observable<any>> {
  constructor(
    private dashboardsService: DashboardsService,
    private loadingService: LoadingService
    ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = +route.paramMap.get('id');

    if (id) {
      this.loadingService.setStatus('Loading dashboard');
      // get specific resource
      return this.dashboardsService.getDashboard(id).pipe(
        catchError(this.handleError)
      );
    } else {
      this.loadingService.setStatus('Loading dashboards');
      return this.dashboardsService.getDashboards().pipe(
        catchError(this.handleError)
      );
      // return all of them
    }

  }

  handleError(error): Observable<any> {
    console.log(error);
    // TODO: route to show error
    return of({ error });
  }

}
