import { Injectable } from "@angular/core";
import { BaseApiService, ListService } from "../interfaces/generic-api-service";
import {
  ApiService,
  MeasurementAggregatedListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { map, Observable } from "rxjs";
import { Aggregate, AggregateAdapter } from "../models/aggregate";

@Injectable({
  providedIn: "root",
})
export class AggregateService
  extends BaseApiService<Aggregate>
  implements ListService<Aggregate>
{
  constructor(protected adapter: AggregateAdapter, protected api: ApiService) {
    super("measurementAggregated", api);
  }

  list(params: {
    stat: string;
    params: MeasurementAggregatedListRequestParams;
  }): Observable<Aggregate[]> {
    return this.api
      .measurementAggregatedList(params.params)
      .pipe(
        map((r) => r.map((a) => this.adapter.adaptFromApi(a, params.stat)))
      );
  }
}
