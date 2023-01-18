import { Injectable } from "@angular/core";
import { ListService } from "../interfaces";
import {
  ApiService,
  MeasurementAggregatedListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { Aggregate } from "../models";
import { ApiEndpoint } from "../enums";
import { BaseReadOnlyApiService } from "./generic-api.service";

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

  /** @inheritdoc */
  deserialize(apiData: any): Aggregate {
    return Aggregate.deserialize(apiData);
  }
}

export interface AggregateService extends ListService<Aggregate> {
  list(
    params: MeasurementAggregatedListRequestParams,
    refresh?: boolean
  ): Observable<Aggregate[]>;
}
