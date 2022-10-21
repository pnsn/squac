import { Injectable } from "@angular/core";
import {
  BaseApiService,
  WriteableApiService,
} from "../interfaces/generic-api-service";
import { Metric, MetricAdapter } from "../models/metric";
import {
  ApiService,
  MeasurementMetricsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { ApiEndpoints } from "@squacapi/interfaces/api.interface";

@Injectable({
  providedIn: "root",
})
export class MetricService
  extends BaseApiService<Metric>
  implements WriteableApiService<Metric>
{
  constructor(protected adapter: MetricAdapter, protected api: ApiService) {
    super(ApiEndpoints.METRIC, api);
  }

  read(id: number): Observable<Metric> {
    return super.read(id);
  }
  list(params?: MeasurementMetricsListRequestParams): Observable<Metric[]> {
    return super._list(params);
  }
  updateOrCreate(t: Metric): Observable<Metric> {
    return super._updateOrCreate(t);
  }
}
