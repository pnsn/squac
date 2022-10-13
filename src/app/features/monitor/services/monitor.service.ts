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
  constructor(monitorAdapter: MonitorAdapter, private api: ApiService) {
    super(monitorAdapter);
  }
  protected apiList = (params: MeasurementMonitorsListRequestParams) =>
    this.api.measurementMonitorsList(params);
  protected apiRead = (params: MeasurementMonitorsReadRequestParams) =>
    this.api.measurementMonitorsRead(params);
  protected apiCreate = (params: MeasurementMonitorsCreateRequestParams) =>
    this.api.measurementMonitorsCreate(params);
  protected apiUpdate = (params: MeasurementMonitorsUpdateRequestParams) =>
    this.api.measurementMonitorsUpdate(params);
  protected apiDelete = (params: MeasurementMonitorsDeleteRequestParams) =>
    this.api.measurementMonitorsDelete(params);
}
