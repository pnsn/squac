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
  localAlerts: {[monitorId : number]: Alert[]} = {};
  alerts : Subject<Alert[]> = new Subject();
  refreshTimeout;

  private url = 'measurement/alerts/';


  constructor(
    private squacApi: SquacApiService,
    private alertAdapter: AlertAdapter
  ) {}

  ngOnDestroy(): void {
    this.clearTimeout();
  }

  // Clears any active timeout
  private clearTimeout() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
  }

  getAlerts(refresh: boolean) : Subject<Alert[]>{
    if(refresh && !this.refreshTimeout) {
      this.refreshTimeout = setTimeout(() => {
        this.fetchAlerts();
      }, 5 * 60 * 1000);
    } 
    
    this.fetchAlerts();
  
    return this.alerts;
  }

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
    // this.localAlerts = {};
    // for(let alert of alerts) {
    //   const localAlerts = this.localAlerts[alert.trigger.monitorId];
    //   if(localAlerts) {
    //     localAlerts.push(alert)
    //   } else {
    //     this.localAlerts[alert.trigger.monitorId]=[alert];
    //   }
    // }
  }

  getAlert(id: number) : Observable<Alert> {
    return this.squacApi.get(this.url, id).pipe(
      map( response => this.alertAdapter.adaptFromApi(response))
    );
  }
}
