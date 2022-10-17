import { Injectable } from "@angular/core";
import { ReadWriteDeleteApiService } from "@core/models/generic-api-service";
import { Monitor, MonitorAdapter } from "@monitor/models/monitor";
import {
  ApiService,
  MeasurementMonitorsCreateRequestParams,
  MeasurementMonitorsDeleteRequestParams,
  MeasurementMonitorsListRequestParams,
  MeasurementMonitorsReadRequestParams,
  MeasurementMonitorsUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})
export class MonitorService extends ReadWriteDeleteApiService<Monitor> {
  constructor(protected adapter: MonitorAdapter, protected api: ApiService) {
    super("measurementMonitors", api);
  }
}
