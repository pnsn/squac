import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { LoadingService } from '@core/services/loading.service';
import { MessageService } from '@core/services/message.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Alarm } from './models/alarm';
import { AlarmsService } from './services/alarms.service';

@Injectable({
  providedIn: 'root'
})
export class AlarmsResolver implements Resolve<Observable<any>> {
  constructor(
    private alarmsService: AlarmsService,
    private loadingService: LoadingService,
    private messageService: MessageService
    ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Alarm> | Observable<Alarm[]> {
    const id = +route.paramMap.get('alarmId');

    if (id) {
      this.loadingService.setStatus('Loading alarm');
      return this.alarmsService.getAlarm(id).pipe(
        catchError(error => {
          this.messageService.error('Could not load alarm.');
          return this.handleError(error);
        })
      );
    } else {
      this.loadingService.setStatus('Loading alarms');
      return this.alarmsService.getAlarms().pipe(
        catchError(error => {
          this.messageService.error('Could not load alarms.');
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
