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

/**
 * Service for requesting measurements from squacapi
 */
@Injectable({
  providedIn: "root",
})
export class MeasurementService extends BaseApiService<Measurement> {
  constructor(override adapter: MeasurementAdapter, override api: ApiService) {
    super(ApiEndpoint.MEASUREMENT, api);
  }
}

export interface MeasurementService extends ListService<Measurement> {
  list(
    params: MeasurementMeasurementsListRequestParams,
    refresh?: boolean
  ): Observable<Measurement[]>;
}
