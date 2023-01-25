import { Injectable } from "@angular/core";
import { ListService } from "../interfaces";
import {
  ApiService,
  MeasurementAggregatedListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { ApiEndpoint } from "../enums";
import { BaseReadOnlyApiService } from "./generic-api.service";
import { Aggregate } from "../models";

/**
 * Service for requesting aggregates
 */
@Injectable({
  providedIn: "root",
})
export class AggregateService extends BaseReadOnlyApiService<Aggregate> {
  constructor(override api: ApiService) {
    super(ApiEndpoint.AGGREGATE, api);
  }
}

export interface AggregateService extends ListService<Aggregate> {
  list(
    params: MeasurementAggregatedListRequestParams,
    refresh?: boolean
  ): Observable<Aggregate[]>;
}
