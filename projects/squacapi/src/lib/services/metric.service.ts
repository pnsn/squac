import { Injectable } from "@angular/core";
import { WriteableApiService } from "../interfaces";
import { BaseApiService } from "./generic-api.service";
import { Metric, MetricAdapter } from "../models";
import {
  ApiService,
  MeasurementMetricsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { ApiEndpoint } from "../enums";

/**
 * Service for managing metrics
 */
@Injectable({
  providedIn: "root",
})
export class MetricService extends BaseApiService<Metric> {
  constructor(override adapter: MetricAdapter, override api: ApiService) {
    super(ApiEndpoint.METRIC, api);
  }
}

export interface MetricService extends WriteableApiService<Metric> {
  read(id: number, refresh?: boolean): Observable<Metric>;
  list(
    params?: MeasurementMetricsListRequestParams,
    refresh?: boolean
  ): Observable<Metric[]>;
  updateOrCreate(t: Metric): Observable<Metric>;
}
