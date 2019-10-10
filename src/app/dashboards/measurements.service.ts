import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, empty, EMPTY } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { SquacApiService } from '../squacapi.service';
import { Measurement } from './measurement';

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

  getMeasurements(metrics: string, channels: string, start: string, end: string ): Observable<any> {
    // TODO: find a better way for this
    if (metrics && channels && start && end) {
      return this.squacApi.get(this.url, null,
        {
           metric: metrics,
           channel: channels,
           starttime: start,
           endtime: end,
        }
      ).pipe(
        map(response => {
          const data = {};
          response.forEach(m => {
            if (!data[m.channel]) {
              data[m.channel] = {};
            }
            if (!data[m.channel][m.metric]) {
              data[m.channel][m.metric] = [];
            }
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
