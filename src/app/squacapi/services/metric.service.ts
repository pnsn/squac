import { Injectable } from "@angular/core";
import {
  ReadWriteApiService,
  SquacApiService,
} from "../interfaces/generic-api-service";
import { Metric, MetricAdapter } from "../models/metric";
import { ApiService } from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})
export class MetricService extends SquacApiService<Metric> {
  constructor(protected adapter: MetricAdapter, protected api: ApiService) {
    super("measurementMetrics", api);
  }
}
