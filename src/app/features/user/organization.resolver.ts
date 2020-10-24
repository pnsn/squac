import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { LoadingService } from '@core/services/loading.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OrganizationsService } from './services/organizations.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationResolver implements Resolve<Observable<any>> {
  constructor(
    private orgService: OrganizationsService,
    private loadingService: LoadingService
    ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = +route.paramMap.get('orgId');

    if(id) {
      this.loadingService.setStatus("Loading organization")
      return this.orgService.getOrganization(id).pipe(
        catchError(this.handleError)
      );
    } else {
      this.loadingService.setStatus("Loading organizations")
      return this.orgService.getOrganizations().pipe(
        catchError(this.handleError)
      );
    }
  }

  handleError(error): Observable<any> {
    // TODO: route to show error
    return of({ error });
  }

}
