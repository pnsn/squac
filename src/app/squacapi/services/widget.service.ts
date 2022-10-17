import { Injectable } from "@angular/core";
import { ReadWriteDeleteApiService } from "../interfaces/generic-api-service";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { Widget, WidgetAdapter } from "../models/widget";

@Injectable({
  providedIn: "root",
})
// Class for widget interaction with squac
export class WidgetService extends ReadWriteDeleteApiService<Widget> {
  constructor(protected adapter: WidgetAdapter, protected api: ApiService) {
    super("dashboardWidgets", api);
  }
}
