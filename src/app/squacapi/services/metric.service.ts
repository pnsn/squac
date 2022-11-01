import { Injectable } from "@angular/core";
import { WriteableApiService } from "../interfaces/api-service.interface";
import { BaseApiService } from "./generic-api.service";
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

  read(id: number, refresh?: boolean): Observable<Metric> {
    return super.read(id, { refresh });
  }
  list(
    params?: MeasurementMetricsListRequestParams,
    refresh?: boolean
  ): Observable<Metric[]> {
    return super._list(params, { refresh });
  }
  updateOrCreate(t: Metric): Observable<Metric> {
    return super._updateOrCreate(t);
  }
}
