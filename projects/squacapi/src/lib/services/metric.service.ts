import { Injectable } from "@angular/core";
import { WriteableApiService } from "../interfaces";
import { BaseWriteableApiService } from "./generic-api.service";
import { Metric } from "../models";
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
export class MetricService extends BaseWriteableApiService<Metric> {
  constructor(override api: ApiService) {
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
