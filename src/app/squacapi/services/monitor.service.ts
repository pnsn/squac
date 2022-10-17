import { Injectable } from "@angular/core";
import { ReadWriteDeleteApiService } from "../interfaces/generic-api-service";
import { Monitor, MonitorAdapter } from "../models/monitor";
import { ApiService } from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})
export class MonitorService extends ReadWriteDeleteApiService<Monitor> {
  constructor(protected adapter: MonitorAdapter, protected api: ApiService) {
    super("measurementMonitors", api);
  }
}
