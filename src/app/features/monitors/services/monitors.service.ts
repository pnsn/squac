import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Monitor } from '../models/monitor';

interface MonitorPostData {
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
export class MonitorsService {

  private url = 'measurement/alarms/';


  constructor(
    private squacApi: SquacApiService
  ) {}

  testMonitors: Monitor[] = [
    {
      id: 1,
      channelGroupId: 1,
      name: "monitor name",
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
      name: "monitor name",
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
      name: "monitor name",
      metricId: 5,
      intervalType: "day",
      intervalCount: 10,
      numberChannels: 1,
      stat: "avg",
      owner: 1
    }
  ]
  
  getMonitors() : Observable<Monitor[]>{
    return of(this.testMonitors);

    // return this.squacApi.get(this.url).pipe(
    //   map(
    //     results => {
    //       const monitors: Monitor[] = [];

    //       results.forEach(monitor => {
    //         monitors.push(this.mapMonitor(monitor));
    //       });
    //       return monitors;
    //     }
    //   )
    // );
  }
  
  getMonitor(id: number) : Observable<Monitor>{
    return of(this.testMonitors[id -1]);
    // return this.squacApi.get(this.url, id).pipe(
    //   map(
    //     response => {
    //       return this.mapMonitor(response);
    //     }
    //   )
    // )
  }

    // Replaces channel group with new channel group
    updateMonitor(monitor: Monitor) : Observable<Monitor>{
      const postData : MonitorPostData = {
        channel_group: monitor.channelGroupId,
        metric: monitor.metricId,
        interval_type: monitor.intervalType,
        interval_count: monitor.intervalCount,
        num_channels: monitor.numberChannels,
        stat: monitor.stat
      };

      this.testMonitors.push(
        {
          id: this.testMonitors.length + 1,
          channelGroupId: monitor.channelGroupId,
          name: "monitor name",
          metricId: monitor.metricId,
          intervalType: monitor.intervalType,
          intervalCount: monitor.intervalCount,
          numberChannels: monitor.numberChannels,
          stat: monitor.stat,
          owner: 1
        }
      )
      
      return of(monitor);
      // if (monitor.id) {
      //   postData.id = monitor.id;
      //   return this.squacApi.put(this.url, monitor.id, postData).pipe(map(
      //     response => this.mapMonitor(response)
      //   ));
      // }
      // return this.squacApi.post(this.url, postData).pipe(map(
      //   response => this.mapMonitor(response)
      // ));
    }

  mapMonitor(monitor) {

    return monitor;
  }
  //getMonitors

  //getMonitor

}
