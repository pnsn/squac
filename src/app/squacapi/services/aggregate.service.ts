import { Injectable } from "@angular/core";
import { ListService } from "../interfaces/api-service.interface";
import {
  ApiService,
  MeasurementAggregatedListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";
import { Aggregate, AggregateAdapter } from "../models/aggregate";
import { ApiEndpoints } from "@squacapi/interfaces/api.interface";
import { BaseApiService } from "./generic-api.service";

@Injectable({
  providedIn: "root",
})
export class AggregateService
  extends BaseApiService<Aggregate>
  implements ListService<Aggregate>
{
  constructor(protected adapter: AggregateAdapter, protected api: ApiService) {
    super(ApiEndpoints.AGGREGATE, api);
  }

  list(
    params: MeasurementAggregatedListRequestParams
  ): Observable<Aggregate[]> {
    return super._list(params);
  }
}
