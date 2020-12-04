import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';
import { map } from 'rxjs/operators';
import { AlarmThreshold } from '../models/alarm-threshold';

@Injectable({
  providedIn: 'root'
})
export class AlarmThresholdsService {


  private url = 'measurement/alarm-thresholds/';


  constructor(
    private squacApi: SquacApiService
  ) {}
  
  getAlarmThresholds() {
    return this.squacApi.get(this.url).pipe(
      map(
        results => {
          const alarmThresholds: AlarmThreshold[] = [];

          results.forEach(alarmThreshold => {
            alarmThresholds.push(this.mapAlarmThreshold(alarmThreshold));
          });
          return alarmThresholds;
        }
      )
    );
  }
  
  getAlarmThreshold(id: number) {
    return this.squacApi.get(this.url, id).pipe(
      map(
        response => {
          return this.mapAlarmThreshold(response);
        }
      )
    )
  }

    // Replaces channel group with new channel group
    updateAlarmThreshold(alarmThreshold: AlarmThreshold) {
      const postData = {
        id: 1
      };

      if (alarmThreshold.id) {
        postData.id = alarmThreshold.id;
        return this.squacApi.put(this.url, alarmThreshold.id, postData).pipe(map(
          response => this.mapAlarmThreshold(response)
        ));
      }
      return this.squacApi.post(this.url, postData).pipe(map(
        response => this.mapAlarmThreshold(response)
      ));
    }

  mapAlarmThreshold(alarmThreshold) {

    return alarmThreshold;
  }
}
