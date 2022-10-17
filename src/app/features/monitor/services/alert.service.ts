import { Injectable } from "@angular/core";
import { ListApiService } from "@core/models/generic-api-service";
import { Alert, AlertAdapter } from "@monitor/models/alert";
import { ApiService } from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})
export class AlertService extends ListApiService<Alert> {
  constructor(protected adapter: AlertAdapter, protected api: ApiService) {
    super("measurementAlerts", api);
  }
}
