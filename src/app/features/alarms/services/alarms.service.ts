import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';
import { map, tap } from 'rxjs/operators';
import { Alarm } from '../models/alarm';

@Injectable({
  providedIn: 'root'
})
export class AlarmsService {

  private url = 'measurement/alarm/';


  constructor(
    private squacApi: SquacApiService
  ) {}
  
  getAlarms() {
    return this.squacApi.get(this.url).pipe(
      map(
        results => {
          const alarms: Alarm[] = [];

          results.forEach(alarm => {
            alarms.push(this.mapAlarm(alarm));
          });
          return alarms;
        }
      )
    );
  }
  
  getAlarm(id: number) {
    return this.squacApi.get(this.url, id).pipe(
      map(
        response => {
          return this.mapAlarm(response);
        }
      )
    )
  }

    // Replaces channel group with new channel group
    updateAlarm(alarm: Alarm) {
      const postData = {
        id: 1
      };

      if (alarm.id) {
        postData.id = alarm.id;
        return this.squacApi.put(this.url, alarm.id, postData).pipe(map(
          response => this.mapAlarm(response)
        ));
      }
      return this.squacApi.post(this.url, postData).pipe(map(
        response => this.mapAlarm(response)
      ));
    }

  mapAlarm(alarm) {

    return alarm;
  }
  //getAlarms

  //getAlarm

}
