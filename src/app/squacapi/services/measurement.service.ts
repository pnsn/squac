import { Injectable } from "@angular/core";
import { ListService } from "../interfaces";
import { BaseApiService } from "./generic-api.service";
import {
  ApiService,
  MeasurementMeasurementsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { Measurement, MeasurementAdapter } from "../models";
import { ApiEndpoint } from "../enums";

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
    super(ApiEndpoint.MEASUREMENT, api);
  }

  // gets data from squac, returns measurements or archives
  list(
    params: MeasurementMeasurementsListRequestParams,
    refresh?: boolean
  ): Observable<Measurement[]> {
    return super._list(params, { refresh });
  }
}
