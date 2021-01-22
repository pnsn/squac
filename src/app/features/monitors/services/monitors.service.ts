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

  getMonitors() : Observable<Monitor[]>{
    return this.squacApi.get(this.url).pipe(
      map(
        results => {
          const monitors: Monitor[] = [];

          results.forEach(monitor => {
            monitors.push(this.mapMonitor(monitor));
          });
          return monitors;
        }
      )
    );
  }
  
  getMonitor(id: number) : Observable<Monitor>{
    return this.squacApi.get(this.url, id).pipe(
      map(
        response => {
          return this.mapMonitor(response);
        }
      )
    );
  }

    // Replaces channel group with new channel group
    updateMonitor(monitor: Monitor) : Observable<Monitor>{
      const postData : MonitorPostData = {
        interval_type: monitor.intervalType,
        interval_count: monitor.intervalCount,
        num_channels: monitor.numberChannels,
        channel_group: monitor.channelGroupId,
        metric: monitor.metricId,
        stat: monitor.stat
      };
      console.log(postData)
      if (monitor.id) {
        return this.squacApi.put(this.url, monitor.id, postData).pipe(map(
          response => this.mapMonitor(response)
        ));
      }
      return this.squacApi.post(this.url, postData).pipe(map(
        response => this.mapMonitor(response)
      ));
    }

  mapMonitor(monitor) {
    let newMonitor: Monitor = {
      id: monitor.id,
      name: "name",
      channelGroupId: monitor.channel_group,
      metricId: monitor.metric,
      intervalType: monitor.interval_type,
      intervalCount: monitor.interval_count,
      numberChannels: monitor.num_channels,
      stat: monitor.stat,
      owner: monitor.user_id,

    }

    return newMonitor;
  }

  deleteMonitor(){

  };
  //getMonitors

  //getMonitor

}
