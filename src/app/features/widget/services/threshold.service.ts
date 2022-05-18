import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SquacApiService } from "@core/services/squacapi.service";
import { Metric } from "@core/models/metric";
import {
  ApiPostThreshold,
  Threshold,
  ThresholdAdapter,
} from "@widget/models/threshold";

@Injectable({
  providedIn: "root",
})
// Class for widget interaction with squac
export class ThresholdService {
  private url = "measurement/thresholds/";

  constructor(
    private squacApi: SquacApiService,
    private thresholdAdapter: ThresholdAdapter
  ) {}

  updateThresholds(
    thresholds: Threshold[],
    widgetId: number
  ): Observable<Threshold>[] {
    const thresholdSubs = [];
    for (const threshold of thresholds) {
      if (threshold.id && threshold.max === null && threshold.min === null) {
        thresholdSubs.push(this.deleteThreshold(threshold.id));
      } else if (threshold.max !== null || threshold.min !== null) {
        thresholdSubs.push(this.updateThreshold(threshold, widgetId));
      }
    }
    return thresholdSubs;
  }

  private updateThreshold(threshold: Threshold, widgetId) {
    threshold.widgetId = widgetId;
    const postData: ApiPostThreshold =
      this.thresholdAdapter.adaptToApi(threshold);

    if (threshold.id) {
      return this.squacApi.put(this.url, threshold.id, postData);
    } else {
      return this.squacApi.post(this.url, postData);
    }
  }

  deleteThreshold(id) {
    return this.squacApi.delete(this.url, id);
  }
}
