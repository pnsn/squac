import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';
import { map } from 'rxjs/operators';
import { Alert } from '../models/alert';
import { Trigger } from '../models/trigger';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  private url = 'measurement/alerts/';


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
    );
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
    const t = alert.trigger;
    const trigger = new Trigger(
      t.id,
      t.monitor,
      t.band_inclusive,
      t.level,
      t.user_id,
      t.minval,
      t.maxval
    );

    const newAlert = new Alert(
      alert.id,
      alert.user_id,
      alert.timestamp,
      alert.message,
      alert.in_alarm,
      trigger
    );

    return newAlert;
  }
}
