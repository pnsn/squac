import { Injectable } from "@angular/core";
import { ListService } from "../interfaces";
import {
  ApiService,
  MeasurementAggregatedListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { Aggregate, AggregateAdapter } from "../models";
import { ApiEndpoint } from "../enums";
import { BaseApiService } from "./generic-api.service";

/**
 * Service for requesting aggregates
 */
@Injectable({
  providedIn: "root",
})
export class AggregateService extends BaseApiService<Aggregate> {
  constructor(override adapter: AggregateAdapter, override api: ApiService) {
    super(ApiEndpoint.AGGREGATE, api);
  }
}

export interface AggregateService extends ListService<Aggregate> {
  list(
    params: MeasurementAggregatedListRequestParams,
    refresh?: boolean
  ): Observable<Aggregate[]>;
}
