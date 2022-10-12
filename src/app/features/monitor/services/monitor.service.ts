import { Injectable } from "@angular/core";
import { ReadWriteDeleteApiService } from "@core/models/generic-api-service";
import { Monitor, MonitorAdapter } from "@monitor/models/monitor";
import {
  ApiService,
  MeasurementMeasurementsListRequestParams,
  MeasurementMeasurementsReadRequestParams,
  MeasurementMonitorsCreateRequestParams,
  MeasurementMonitorsDeleteRequestParams,
  MeasurementMonitorsUpdateRequestParams,
} from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})
export class MonitorService extends ReadWriteDeleteApiService<Monitor> {
  constructor(monitorAdapter: MonitorAdapter, private api: ApiService) {
    super(monitorAdapter);
  }
  protected apiList = (params: MeasurementMeasurementsListRequestParams) =>
    this.api.measurementMeasurementsList(params);
  protected apiRead = (params: MeasurementMeasurementsReadRequestParams) =>
    this.api.measurementMeasurementsRead(params);
  protected apiCreate = (params: MeasurementMonitorsCreateRequestParams) =>
    this.api.measurementMonitorsCreate(params);
  protected apiUpdate = (params: MeasurementMonitorsUpdateRequestParams) =>
    this.api.measurementMonitorsUpdate(params);
  protected apiDelete = (params: MeasurementMonitorsDeleteRequestParams) =>
    this.api.measurementMonitorsDelete(params);
}
