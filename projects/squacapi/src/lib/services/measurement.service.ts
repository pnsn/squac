import { Injectable } from "@angular/core";
import { ListService } from "../interfaces";
import { BaseApiService } from "./generic-api.service";
import {
  ApiService,
  MeasurementMeasurementsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { Measurement, MeasurementAdapter } from "../../../models";
import { ApiEndpoint } from "../enums";

/**
 *
 */
@Injectable({
  providedIn: "root",
})
export class MeasurementService
  extends BaseApiService<Measurement>
  implements ListService<Measurement>
{
  constructor(override adapter: MeasurementAdapter, override api: ApiService) {
    super(ApiEndpoint.MEASUREMENT, api);
  }

  /**
   * Request list of measurements
   *
   * @param params
   * @param refresh
   */
  list(
    params: MeasurementMeasurementsListRequestParams,
    refresh?: boolean
  ): Observable<Measurement[]> {
    return super._list(params, { refresh });
  }
}
