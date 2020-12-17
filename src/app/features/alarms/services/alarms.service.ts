import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Alarm } from '../models/alarm';

interface AlarmPostData {
  channel_group: number,
  metric: number,
  interval_type: string,
  interval_count: number,
  num_channels: number,
  stat: string
}

@Injectable({
  providedIn: 'root'
})
export class AlarmsService {

  private url = 'measurement/alarms/';


  constructor(
    private squacApi: SquacApiService
  ) {}

  testAlarms: Alarm[] = [
    {
      id: 1,
      channelGroupId: 1,
      name: "alarm name",
      metricId: 5,
      intervalType: "minute",
      intervalCount: 10,
      numberChannels: 1,
      stat: "count",
      owner: 1
    },
    {
      id: 2,
      channelGroupId: 4,
      name: "alarm name",
      metricId: 5,
      intervalType: "hour",
      intervalCount: 10,
      numberChannels: 1,
      stat: "max",
      owner: 1
    },
    {
      id: 3,
      channelGroupId: 5,
      name: "alarm name",
      metricId: 5,
      intervalType: "day",
      intervalCount: 10,
      numberChannels: 1,
      stat: "avg",
      owner: 1
    }
  ]
  
  getAlarms() : Observable<Alarm[]>{
    return of(this.testAlarms);

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
    return of(this.testAlarms[id -1]);
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
      const postData : AlarmPostData = {
        channel_group: alarm.channelGroupId,
        metric: alarm.metricId,
        interval_type: alarm.intervalType,
        interval_count: alarm.intervalCount,
        num_channels: alarm.numberChannels,
        stat: alarm.stat
      };

      this.testAlarms.push(
        {
          id: this.testAlarms.length + 1,
          channelGroupId: alarm.channelGroupId,
          name: "alarm name",
          metricId: alarm.metricId,
          intervalType: alarm.intervalType,
          intervalCount: alarm.intervalCount,
          numberChannels: alarm.numberChannels,
          stat: alarm.stat,
          owner: 1
        }
      )
      
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
