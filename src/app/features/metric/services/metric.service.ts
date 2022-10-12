import { Injectable } from "@angular/core";
import { ReadWriteApiService } from "@core/models/generic-api-service";
import { Metric, MetricAdapter } from "@core/models/metric";
import {
  ApiService,
  MeasurementMetricsCreateRequestParams,
  MeasurementMetricsListRequestParams,
  MeasurementMetricsReadRequestParams,
  MeasurementMetricsUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})
export class MetricService extends ReadWriteApiService<Metric> {
  constructor(metricAdapter: MetricAdapter, private api: ApiService) {
    super(metricAdapter);
  }

  protected apiList = (params: MeasurementMetricsListRequestParams) =>
    this.api.measurementMetricsList(params);

  protected apiRead = (params: MeasurementMetricsReadRequestParams) =>
    this.api.measurementMetricsRead(params);

  protected apiCreate = (params: MeasurementMetricsCreateRequestParams) =>
    this.api.measurementMetricsCreate(params);

  protected apiUpdate = (params: MeasurementMetricsUpdateRequestParams) =>
    this.api.measurementMetricsUpdate(params);
}
