import { Injectable } from "@angular/core";
import { ReadWriteApiService } from "@core/models/generic-api-service";
import { Metric, MetricAdapter } from "@core/models/metric";
import { ApiService } from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})
export class MetricService extends ReadWriteApiService<Metric> {
  constructor(protected adapter: MetricAdapter, protected api: ApiService) {
    super("measurementMetrics", api);
  }
}
