import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Monitor, MonitorAdapter } from '../models/monitor';
import { Trigger } from '../models/trigger';

interface MonitorPostData {
  channel_group: number;
  metric: number;
  interval_type: string;
  interval_count: number;
  num_channels: number;
  stat: string;
}

@Injectable({
  providedIn: 'root'
})
export class MonitorsService {

  private url = 'measurement/monitors/';

  constructor(
    private squacApi: SquacApiService,
    private monitorAdapter: MonitorAdapter
  ) {}

  getMonitors(): Observable<Monitor[]>{
    return this.squacApi.get(this.url).pipe(
      map(
        results => results.map(monitor => this.monitorAdapter.adapt(monitor))
      )
    );
  }

  getMonitor(id: number): Observable<Monitor>{
    return this.squacApi.get(this.url, id).pipe(
      map(
        response => this.monitorAdapter.adapt(response)
      )
    );
  }

    // Replaces channel group with new channel group
    updateMonitor(monitor: Monitor): Observable<Monitor>{
      const postData: MonitorPostData = {
        interval_type: monitor.intervalType,
        interval_count: monitor.intervalCount,
        num_channels: monitor.numberChannels,
        channel_group: monitor.channelGroupId,
        metric: monitor.metricId,
        stat: monitor.stat
      };
      console.log(postData);
      if (monitor.id) {
        return this.squacApi.put(this.url, monitor.id, postData).pipe(map(
          response => this.monitorAdapter.adapt(response)
        ));
      }
      return this.squacApi.post(this.url, postData).pipe(map(
        response => this.monitorAdapter.adapt(response)
      ));
    }

  // mapMonitor(response) {
  //   let triggers = [];
  //   if (response.triggers) {
  //     response.triggers.forEach(t => {
  //       const trigger: Trigger = {
  //         id: t.id,
  //         monitorId: t.monitor,
  //         bandInclusive: t.band_inclusive,
  //         level: t.level,
  //         owner: t.user_id,
  //         min: t.minval,
  //         max: t.maxval
  //       };
  //       triggers.push(trigger);
  //     });


  //   } else {
  //    triggers = [...this.testTriggers];
  //   }
  //   const newMonitor: Monitor = {
  //     id: response.id,
  //     name: 'name',
  //     channelGroupId: response.channel_group,
  //     metricId: response.metric,
  //     intervalType: response.interval_type,
  //     intervalCount: response.interval_count,
  //     numberChannels: response.num_channels,
  //     stat: response.stat,
  //     owner: response.user_id,
  //     triggers
  //   };

  //   return newMonitor;
  // }

  deleteMonitor(id: number){
    return this.squacApi.delete(this.url, id);
  }
  // getMonitors

  // getMonitor

}
