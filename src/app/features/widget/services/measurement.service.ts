import { Injectable } from "@angular/core";
import { ListApiService } from "@core/models/generic-api-service";
import {
  ApiService,
  MeasurementMeasurementsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { map, Observable } from "rxjs";
import { Measurement, MeasurementAdapter } from "../models/measurement";

@Injectable({
  providedIn: "root",
})
export class MeasurementService extends ListApiService<Measurement> {
  constructor(adapter: MeasurementAdapter, private api: ApiService) {
    super(adapter);
  }

  protected apiList = (params: MeasurementMeasurementsListRequestParams) =>
    this.api.measurementMeasurementsList(params);

  // gets data from squac, returns measurements or archives
  list(
    params: MeasurementMeasurementsListRequestParams
  ): Observable<Measurement[]> {
    return this.api
      .measurementMeasurementsList(params)
      .pipe(map((r) => r.map(this.adapter.adaptFromApi)));
  }
}
