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
    const id = parseInt(route.paramMap.get('id'), 10);
    console.log("organization", id)
    return this.orgService.getOrganization(id).pipe(
      tap(data=> {
        console.log("in resolver, organization")
      }),
      catchError(this.handleError)
    );
  }

  handleError(error) : Observable<any>{
    //TODO: route to show error
    return of({ error: error });
  }

}