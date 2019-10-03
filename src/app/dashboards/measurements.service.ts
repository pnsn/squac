import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
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

  // "?metric=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19&channel=2,6&starttime=2018-01-01&endtime=2019-10-02"

  constructor(
    private squacApi: SquacApiService
  ) {}

  getMeasurements(metrics: string, channels: string, start: string, end: string ): Observable<Measurement> {
    return this.squacApi.get(this.url, null,
      {
         metric: metrics,
         channel: channels,
         starttime: start,
         endtime: end,
      }
    ).pipe();
  }
}
