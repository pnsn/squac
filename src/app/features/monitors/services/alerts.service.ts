import { Injectable, OnDestroy } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Alert, AlertAdapter } from '../models/alert';
import { Trigger } from '../models/trigger';

@Injectable({
  providedIn: 'root'
})
export class AlertsService implements OnDestroy{
  localAlerts: {[monitorId: number]: Alert[]} = {};
  alerts: Subject<Alert[]> = new Subject();
  refreshTimeout;

  private url = 'measurement/alerts/';


  constructor(
    private squacApi: SquacApiService,
    private alertAdapter: AlertAdapter
  ) {}

  ngOnDestroy(): void {
  }

  getAlerts(): Observable<Alert[]>{
    return this.squacApi.get(this.url).pipe(
      map( results => results.map(r => this.alertAdapter.adaptFromApi(r)))
    );
  }

  getAlert(id: number): Observable<Alert> {
    return this.squacApi.get(this.url, id).pipe(
      map( response => this.alertAdapter.adaptFromApi(response))
    );
  }
}
