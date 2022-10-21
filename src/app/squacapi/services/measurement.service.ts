import { Injectable } from "@angular/core";
import { BaseApiService, ListService } from "../interfaces/generic-api-service";
import {
  ApiService,
  MeasurementMeasurementsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { Measurement, MeasurementAdapter } from "../models/measurement";
import { ApiEndpoints } from "@squacapi/interfaces/api.interface";

@Injectable({
  providedIn: "root",
})
export class MeasurementService
  extends BaseApiService<Measurement>
  implements ListService<Measurement>
{
  constructor(
    protected adapter: MeasurementAdapter,
    protected api: ApiService
  ) {
    super(ApiEndpoints.MEASUREMENT, api);
  }

  // gets data from squac, returns measurements or archives
  list(
    params: MeasurementMeasurementsListRequestParams
  ): Observable<Measurement[]> {
    return super._list(params);
  }
}
