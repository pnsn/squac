import { Injectable, EventEmitter } from '@angular/core';
import { SquacApiService } from '../squacapi.service';
import { Observable, forkJoin, empty, EMPTY } from 'rxjs';
import { Widget } from './widget';
import { map } from 'rxjs/operators';
import { Metric } from '../shared/metric';
import { Threshold } from './threshold';


interface ThresholdHttpData {
  widget: number, 
  metric : number, 
  maxval: number, 
  minval: number,
  id?: number
}

@Injectable({
  providedIn: 'root'
})
// Class for widget interaction with squac
export class ThresholdsService {

  private url = 'measurement/thresholds/';

  constructor(
    private squacApi: SquacApiService
  ) {
  }

  updateThreshold(threshold: Threshold) {

    const postData: ThresholdHttpData = { 
      widget: threshold.widgetId,
      metric: threshold.metricId,
      minval: threshold.min,
      maxval: threshold.max
    };
    if (threshold.id) {
      postData.id = threshold.id;
      return this.squacApi.put(this.url, threshold.id, postData);
    } else {
      return this.squacApi.post(this.url, postData);
    }
  }

}
