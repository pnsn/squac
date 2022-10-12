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
  ReadOnlyMeasurementSerializer,
  ReadOnlyMonitorSerializer,
} from "@pnsn/ngx-squacapi-client";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MonitorService extends ReadWriteDeleteApiService<Monitor> {
  constructor(monitorAdapter: MonitorAdapter, private api: ApiService) {
    super(monitorAdapter);
  }
  protected apiList = (
    params: MeasurementMeasurementsListRequestParams
  ): Observable<ReadOnlyMeasurementSerializer[]> => {
    return this.api.measurementMeasurementsList(params);
  };

  protected apiRead = (
    params: MeasurementMeasurementsReadRequestParams
  ): Observable<ReadOnlyMeasurementSerializer> => {
    return this.api.measurementMeasurementsRead(params);
  };

  protected apiCreate = (
    params: MeasurementMonitorsCreateRequestParams
  ): Observable<ReadOnlyMonitorSerializer> => {
    return this.api.measurementMonitorsCreate(params);
  };

  protected apiUpdate = (
    params: MeasurementMonitorsUpdateRequestParams
  ): Observable<ReadOnlyMonitorSerializer> => {
    return this.api.measurementMonitorsUpdate(params);
  };

  protected apiDelete = (
    params: MeasurementMonitorsDeleteRequestParams
  ): Observable<any> => {
    return this.api.measurementMonitorsDelete(params);
  };
}
