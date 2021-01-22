import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';
import { map } from 'rxjs/operators';
import { Alert } from '../models/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  private url = 'measurement/alert/';


  constructor(
    private squacApi: SquacApiService
  ) {}
  
  getAlerts() {
    return this.squacApi.get(this.url).pipe(
      map(
        results => {
          const alerts: Alert[] = [];

          results.forEach(alert => {
            alerts.push(this.mapAlert(alert));
          });
          return alerts;
        }
      )
    );
  }
  
  getAlert(id: number) {
    return this.squacApi.get(this.url, id).pipe(
      map(
        response => {
          return this.mapAlert(response);
        }
      )
    )
  }

    // Replaces channel group with new channel group
    updateAlert(alert: Alert) {
      const postData = {
        id: 1
      };

      if (alert.id) {
        postData.id = alert.id;
        return this.squacApi.put(this.url, alert.id, postData).pipe(map(
          response => this.mapAlert(response)
        ));
      }
      return this.squacApi.post(this.url, postData).pipe(map(
        response => this.mapAlert(response)
      ));
    }

  mapAlert(alert) {

    return alert;
  }
}
