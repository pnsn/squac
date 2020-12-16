import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { LoadingService } from '@core/services/loading.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MetricsService } from './services/metrics.service';

@Injectable({
  providedIn: 'root'
})
export class MetricsResolver implements Resolve<Observable<any>> {
  constructor(
    private metricsService: MetricsService,
    private loadingService: LoadingService
    ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = +route.paramMap.get('metricId');
    if (id) {
      this.loadingService.setStatus('Loading metric');
      return this.metricsService.getMetric(id).pipe(
        catchError(this.handleError)
      );
    } else {
      this.loadingService.setStatus('Loading metrics');
      return this.metricsService.getMetrics().pipe(
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
