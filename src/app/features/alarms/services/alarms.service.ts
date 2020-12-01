import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Alarm } from '../models/alarm';

@Injectable({
  providedIn: 'root'
})
export class AlarmsService {

  private url = 'measurement/alarms/';


  constructor(
    private squacApi: SquacApiService
  ) {}

  testAlarm: Alarm = {
    id: 1,
    url: "url",
    channelGroup: 1,
    metric: 1,
    intervalType: "interval",
    intervalCount: 10,
    numberChannels: 1,
    stat: "sstat",
    owner: 1
  }
  
  getAlarms() : Observable<Alarm[]>{
    return of([this.testAlarm, this.testAlarm, this.testAlarm]);

    // return this.squacApi.get(this.url).pipe(
    //   map(
    //     results => {
    //       const alarms: Alarm[] = [];

    //       results.forEach(alarm => {
    //         alarms.push(this.mapAlarm(alarm));
    //       });
    //       return alarms;
    //     }
    //   )
    // );
  }
  
  getAlarm(id: number) : Observable<Alarm>{

    return of(this.testAlarm);
    // return this.squacApi.get(this.url, id).pipe(
    //   map(
    //     response => {
    //       return this.mapAlarm(response);
    //     }
    //   )
    // )
  }

    // Replaces channel group with new channel group
    updateAlarm(alarm: Alarm) : Observable<Alarm>{
      const postData = {
        id: 1
      };
      return of(alarm);
      // if (alarm.id) {
      //   postData.id = alarm.id;
      //   return this.squacApi.put(this.url, alarm.id, postData).pipe(map(
      //     response => this.mapAlarm(response)
      //   ));
      // }
      // return this.squacApi.post(this.url, postData).pipe(map(
      //   response => this.mapAlarm(response)
      // ));
    }

  mapAlarm(alarm) {

    return alarm;
  }
  //getAlarms

  //getAlarm

}
