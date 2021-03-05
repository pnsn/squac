import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';
import { map } from 'rxjs/operators';
import { Alert, AlertAdapter } from '../models/alert';
import { Trigger } from '../models/trigger';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  private url = 'measurement/alerts/';


  constructor(
    private squacApi: SquacApiService,
    private alertAdapter: AlertAdapter
  ) {}

  getAlerts() {
    return this.squacApi.get(this.url).pipe(
      map( results => results.map(r => this.alertAdapter.adaptFromApi(r)) )
    );
  }

  getAlert(id: number) {
    return this.squacApi.get(this.url, id).pipe(
      map( response => this.alertAdapter.adaptFromApi(response))
    );
  }

}
