import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Monitor } from '../models/monitor';
import { Trigger } from '../models/trigger';

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

  private url = 'measurement/monitors/';

  testTriggers : Trigger[] = [
    {
      id: 1,
      monitorId: 1,
      bandInclusive: false,
      level: 1,
      owner: 2,
      min: 0,
      max: 10
    },
    {
      id: 2,
      monitorId: 1,
      bandInclusive: true,
      level: 2,
      owner: 2,
      min: 0,
      max: 10
    },
    {
      id: 3,
      monitorId: 1,
      bandInclusive: false,
      level: 3,
      owner: 2,
      min: 0,
      max: 10
    }
  ]

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

  mapMonitor(response) {
    let triggers = [];
    if (response.triggers) {
      response.triggers.forEach(t => {
        const trigger: Trigger = {
          id: t.id,
          monitorId: t.monitor,
          bandInclusive: t.band_inclusive,
          level: t.level,
          owner: t.user_id,
          min: t.minval,
          max: t.maxval
        };
        triggers.push(trigger);
      });


    } else {
     triggers = [...this.testTriggers];
    }
    let newMonitor: Monitor = {
      id: response.id,
      name: "name",
      channelGroupId: response.channel_group,
      metricId: response.metric,
      intervalType: response.interval_type,
      intervalCount: response.interval_count,
      numberChannels: response.num_channels,
      stat: response.stat,
      owner: response.user_id,
      triggers: triggers
    }

    return newMonitor;
  }

  deleteMonitor(id: number){
    return this.squacApi.delete(this.url, id);
  };
  //getMonitors

  //getMonitor

}
