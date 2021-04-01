import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { LoadingService } from '@core/services/loading.service';
import { MessageService } from '@core/services/message.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Alert } from './models/alert';
import { Monitor } from './models/monitor';
import { AlertsService } from './services/alerts.service';

@Injectable({
  providedIn: 'root'
})
export class AlertsResolver implements Resolve<Observable<any>> {
  constructor(
    private alertsService: AlertsService,
    private loadingService: LoadingService,
    private messageService: MessageService
    ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Alert> | Observable<Alert[]> {
    const id = +route.paramMap.get('alertId');
    if (id) {
      this.loadingService.setStatus('Loading alert');
      return this.alertsService.getAlert(id).pipe(
        catchError(error => {
          this.messageService.error('Could not load alert.');
          return this.handleError(error);
        })
      );
    } else {
      this.loadingService.setStatus('Loading alerts');
      return this.alertsService.getAlerts().pipe(
        catchError(error => {
          this.messageService.error('Could not load alerts.');
          return this.handleError(error);
        })
      );
      // return all of them
    }
  }

  handleError(error): Observable<any> {
    // TODO: route to show error
    return of({ error });
  }

}
