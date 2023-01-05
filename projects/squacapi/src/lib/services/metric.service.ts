import { Injectable } from "@angular/core";
import { WriteableApiService } from "../interfaces";
import { BaseApiService } from "./generic-api.service";
import { Metric, MetricAdapter } from "../../../models";
import {
  ApiService,
  MeasurementMetricsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { ApiEndpoint } from "../enums";

/**
 *
 */
@Injectable({
  providedIn: "root",
})
export class MetricService
  extends BaseApiService<Metric>
  implements WriteableApiService<Metric>
{
  constructor(override adapter: MetricAdapter, override api: ApiService) {
    super(ApiEndpoint.METRIC, api);
  }

  /**
   *
   * @param id
   * @param refresh
   */
  override read(id: number, refresh?: boolean): Observable<Metric> {
    return super.read(id, refresh);
  }
  /**
   *
   * @param params
   * @param refresh
   */
  list(
    params?: MeasurementMetricsListRequestParams,
    refresh?: boolean
  ): Observable<Metric[]> {
    return super._list(params, { refresh });
  }
  /**
   *
   * @param t
   */
  updateOrCreate(t: Metric): Observable<Metric> {
    return super._updateOrCreate(t);
  }
}
