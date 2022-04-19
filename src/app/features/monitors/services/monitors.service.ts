import { Injectable } from "@angular/core";
import { SquacApiService } from "@core/services/squacapi.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Monitor, MonitorAdapter } from "../models/monitor";

@Injectable({
  providedIn: "root",
})
export class MonitorsService {
  private url = "measurement/monitors/";

  constructor(
    private squacApi: SquacApiService,
    private monitorAdapter: MonitorAdapter
  ) {}

  getMonitors(): Observable<Monitor[]> {
    return this.squacApi
      .get(this.url)
      .pipe(
        map((results) =>
          results.map((r) => this.monitorAdapter.adaptFromApi(r))
        )
      );
  }

  getMonitor(id: number): Observable<Monitor> {
    return this.squacApi
      .get(this.url, id)
      .pipe(map((response) => this.monitorAdapter.adaptFromApi(response)));
  }

  // Replaces channel group with new channel group
  updateMonitor(monitor: Monitor): Observable<Monitor> {
    const postData = this.monitorAdapter.adaptToApi(monitor);
    if (monitor.id) {
      return this.squacApi
        .put(this.url, monitor.id, postData)
        .pipe(map((response) => this.monitorAdapter.adaptFromApi(response)));
    }
    return this.squacApi
      .post(this.url, postData)
      .pipe(map((response) => this.monitorAdapter.adaptFromApi(response)));
  }

  deleteMonitor(id: number) {
    return this.squacApi.delete(this.url, id);
  }
}
