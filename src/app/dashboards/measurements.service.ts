import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, empty, EMPTY } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { SquacApiService } from '../squacapi.service';
import { Measurement } from './measurement';
import { Widget } from './widget';
import { ChannelGroup } from '../shared/channel-group';

interface MeasurementsHttpData {
  name: string;
  description: string;
  url: string;
  unit: string;
  id?: number;
}

@Injectable({
  providedIn: 'root'
})

export class MeasurementsService {
  private url = 'measurement/measurements/';

  constructor(
    private squacApi: SquacApiService
  ) {}

  getMeasurements(widget: Widget, channelGroup: ChannelGroup, start: string, end: string ): Observable<any> {
    // TODO: find a better way for this
    if (widget.metrics && channelGroup.channels && start && end) {
      const data = {};
      channelGroup.channels.forEach(channel => {
        data[channel.id]={};
        widget.metrics.forEach(metric => {
          data[channel.id][metric.id]=[];
        })
      });
      return this.squacApi.get(this.url, null,
        {
           metric: widget.metricsString,
           channel: channelGroup.channelsString,
           starttime: start,
           endtime: end,
        }
      ).pipe(
        map(response => {
          response.forEach(m => {
            data[m.channel][m.metric].push(
              new Measurement(
                m.id,
                m.metric,
                m.channel,
                m.value,
                m.starttime,
                m.endtime
              )
            );
          });
          return data;
        })
      );
    }
    return EMPTY;
  }
}
