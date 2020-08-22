import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MetricsService } from './services/metrics.service';

@Injectable({
  providedIn: 'root'
})
export class MetricsResolver implements Resolve<Observable<any>> {
  constructor(private metricsService: MetricsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = parseInt(route.paramMap.get('id'), 10);
    if(id) {
      return this.metricsService.getMetric(id).pipe(
        tap(data=> {
          console.log("in resolver, dashboard")
        }),
        catchError(this.handleError)
      );
    } else {
      return this.metricsService.getMetrics().pipe(
        tap(data=> {
          console.log("in resolver, dashboards")
        }),
        catchError(this.handleError)
      );
      //return all of them 
    }
  }
  
  handleError(error) : Observable<any>{
    //TODO: route to show error
    return of({ error: error });
  }

}