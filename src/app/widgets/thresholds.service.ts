import { Injectable, EventEmitter } from '@angular/core';
import { SquacApiService } from '../squacapi.service';
import { Observable, forkJoin, empty, EMPTY } from 'rxjs';
import { Widget } from './widget';
import { map } from 'rxjs/operators';
import { Metric } from '../shared/metric';
import { Threshold } from './threshold';


interface ThresholdHttpData {
  widget: number;
  metric: number;
  maxval: number;
  minval: number;
  id?: number;
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

  // how to handle deleting?
  updateThresholds(metrics: Metric[], thresholds: any, widgetId: number): Observable<Threshold>[] {
    const thresholdSubs = [];
    for (const metric of metrics) {
      if (thresholds[metric.id]) {
        const threshold = thresholds[metric.id];

        if (threshold.id && !threshold.max && !threshold.min) {
          // delete the existing threshold;
          console.log("threshood has null value")
        } else {
          thresholdSubs.push(this.updateThreshold(threshold, widgetId));
        }
      }
    }
    return thresholdSubs;
  }

  updateThreshold(threshold: Threshold, widgetId) {
    const postData: ThresholdHttpData = {
      widget: threshold.widgetId ? threshold.widgetId : widgetId,
      metric: threshold.metricId,
      minval: threshold.min,
      maxval: threshold.max
    };
    console.log('threshold', postData);
    if (threshold.id) {
      postData.id = threshold.id;
      return this.squacApi.put(this.url, threshold.id, postData);
    } else {
      return this.squacApi.post(this.url, postData);
    }
  }

}
