import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { Subject, BehaviorSubject, Observable, empty, EMPTY } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { SquacApiService } from '../squacapi.service';
import { Measurement } from './measurement';
import { Widget } from './widget';
import { ChannelGroup } from '../shared/channel-group';
import { formatDate } from '@angular/common';

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

  getMeasurements(widget: Widget, start: Date, end: Date ): Observable<any> {
    //  TODO: may need to rethink for a more general structure
    if (widget && widget.metrics.length > 0) {
      const startString = formatDate(start, 'yyyy-MM-ddTHH:mm:ssZ', 'en-GB');
      const endString = formatDate(end, 'yyyy-MM-ddTHH:mm:ssZ', 'en-GB');
      const data = {};
      widget.channelGroup.channels.forEach(channel => {
        data[channel.id] = {};
        widget.metrics.forEach(metric => {
          data[channel.id][metric.id] = [];
        });
      });
      return this.squacApi.get(this.url, null,
        {
           metric: widget.metricsString,
           channel: widget.channelGroup.channelsString,
           starttime: startString,
           endtime: endString,
        }
      ).pipe(
        map(response => {
           // FIXME: no data handling
          response.forEach(m => {
            data[m.channel][m.metric].push(
              new Measurement(
                m.id,
                m.user_id,
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
    } else {
      return new Observable<any>();
    }

  }
}
