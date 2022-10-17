import { Injectable } from "@angular/core";
import { ReadApiService } from "../interfaces/generic-api-service";
import { Alert, AlertAdapter } from "../models/alert";
import { ApiService } from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})
export class AlertService extends ReadApiService<Alert> {
  constructor(protected adapter: AlertAdapter, protected api: ApiService) {
    super("measurementAlerts", api);
  }
}
