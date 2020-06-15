import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Measurement } from '../models/measurement';
import { Widget } from '../../../core/models/widget';
import { formatDate } from '@angular/common';
import { SquacApiService } from '@core/services/squacapi.service';

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
           group: widget.channelGroup.id,
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
