import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SquacApiService } from '@core/services/squacapi.service';
import { Metric } from '@core/models/metric';
import { Threshold } from '../models/threshold';


interface ThresholdHttpData {
  widget: number;
  metric: number;
  maxval?: number;
  minval?: number;
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

  updateThresholds(metrics: Metric[], thresholds: any, widgetId: number): Observable<Threshold>[] {
    const thresholdSubs = [];
    for (const metric of metrics) {
      if (thresholds[metric.id]) {
        const threshold = thresholds[metric.id];
        if (threshold.id && threshold.max === null && threshold.min === null) {
          thresholdSubs.push(this.deleteThreshold(threshold.id));
        } else if (threshold.max !== null || threshold.min !== null) {
          thresholdSubs.push(this.updateThreshold(threshold, widgetId));
        }
      }
    }
    return thresholdSubs;
  }

  private updateThreshold(threshold: Threshold, widgetId) {
    const postData: ThresholdHttpData = {
      widget: threshold.widgetId ? threshold.widgetId : widgetId,
      metric: threshold.metricId
    };
    if (threshold.min !== null) {
      postData.minval = threshold.min;
    }
    if (threshold.max !== null) {
      postData.maxval = threshold.max;
    }

    if (threshold.id) {
      postData.id = threshold.id;
      return this.squacApi.put(this.url, threshold.id, postData);
    } else {
      return this.squacApi.post(this.url, postData);
    }
  }

  deleteThreshold(id) {
    return this.squacApi.delete(this.url, id);
  }

}
