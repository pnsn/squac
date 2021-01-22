import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { LoadingService } from '@core/services/loading.service';
import { MessageService } from '@core/services/message.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Monitor } from './models/monitor';
import { MonitorsService } from './services/monitors.service';

@Injectable({
  providedIn: 'root'
})
export class MonitorsResolver implements Resolve<Observable<any>> {
  constructor(
    private monitorsService: MonitorsService,
    private loadingService: LoadingService,
    private messageService: MessageService
    ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Monitor> | Observable<Monitor[]> {
    const id = +route.paramMap.get('monitorId');

    if (id) {
      this.loadingService.setStatus('Loading monitor');
      return this.monitorsService.getMonitor(id).pipe(
        catchError(error => {
          this.messageService.error('Could not load monitor.');
          return this.handleError(error);
        })
      );
    } else {
      this.loadingService.setStatus('Loading monitors');
      return this.monitorsService.getMonitors().pipe(
        catchError(error => {
          this.messageService.error('Could not load monitors.');
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
