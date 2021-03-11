import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Alert, AlertAdapter } from '../models/alert';
import { Trigger } from '../models/trigger';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  localAlerts: {[monitorId : number]: Alert[]} = {};
  alerts : Subject<Alert[]> = new Subject();
  private url = 'measurement/alerts/';


  constructor(
    private squacApi: SquacApiService,
    private alertAdapter: AlertAdapter
  ) {}

  fetchAlerts() : void{
    this.squacApi.get(this.url).pipe(
      map( results => results.map(r => this.alertAdapter.adaptFromApi(r)) )
    ).subscribe(
      alerts => {
        this.updateAlerts(alerts);
      }
    );
  }

  updateAlerts(alerts: Alert[]) : void {
    this.alerts.next(alerts.slice());
    for(let alert of alerts) {
      const localAlerts = this.localAlerts[alert.trigger.monitorId];
      if(localAlerts) {
        localAlerts.push(alert)
      } else {
        this.localAlerts[alert.trigger.monitorId]=[alert];
      }
    }
    console.log(this.localAlerts)
  }

  getAlert(id: number) : Observable<Alert> {
    return this.squacApi.get(this.url, id).pipe(
      map( response => this.alertAdapter.adaptFromApi(response))
    );
  }

}
