import { Injectable } from "@angular/core";
import { ReadWriteApiService } from "@core/models/generic-api-service";
import { Metric, MetricAdapter } from "@core/models/metric";
import {
  ApiService,
  MeasurementMetricsCreateRequestParams,
  MeasurementMetricsListRequestParams,
  MeasurementMetricsReadRequestParams,
  MeasurementMetricsUpdateRequestParams,
  ReadOnlyMetricSerializer,
  WriteOnlyMetricSerializer,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MetricService extends ReadWriteApiService<Metric> {
  constructor(metricAdapter: MetricAdapter, private api: ApiService) {
    super(metricAdapter);
  }
  //** @override */
  protected apiList = (
    params: MeasurementMetricsListRequestParams
  ): Observable<Array<ReadOnlyMetricSerializer>> => {
    return this.api.measurementMetricsList(params);
  };
  protected apiRead = (
    params: MeasurementMetricsReadRequestParams
  ): Observable<ReadOnlyMetricSerializer> => {
    return this.api.measurementMetricsRead(params);
  };
  protected apiCreate = (
    params: MeasurementMetricsCreateRequestParams
  ): Observable<WriteOnlyMetricSerializer> => {
    return this.api.measurementMetricsCreate(params);
  };
  protected apiUpdate = (
    params: MeasurementMetricsUpdateRequestParams
  ): Observable<WriteOnlyMetricSerializer> => {
    return this.api.measurementMetricsUpdate(params);
  };
}
