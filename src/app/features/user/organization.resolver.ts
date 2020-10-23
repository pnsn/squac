import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OrganizationsService } from './services/organizations.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationResolver implements Resolve<Observable<any>> {
  constructor(private orgService: OrganizationsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = +route.paramMap.get('orgId');

    if(id) {
      return this.orgService.getOrganization(id).pipe(
        catchError(this.handleError)
      );
    } else {
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
