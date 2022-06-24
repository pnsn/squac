import { Injectable } from "@angular/core";
import { SquacApiService } from "@core/services/squacapi.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Monitor, MonitorAdapter } from "@monitor/models/monitor";

@Injectable({
  providedIn: "root",
})
export class MonitorService {
  private url = "measurement/monitors/";

  constructor(
    private squacApi: SquacApiService,
    private monitorAdapter: MonitorAdapter
  ) {}

  // get all monitors for user from squacapi
  getMonitors(): Observable<Monitor[]> {
    return this.squacApi
      .get(this.url)
      .pipe(
        map((results) =>
          results.map((r) => this.monitorAdapter.adaptFromApi(r))
        )
      );
  }

  // get monitor with id
  getMonitor(id: number): Observable<Monitor> {
    return this.squacApi
      .get(this.url, id)
      .pipe(map((response) => this.monitorAdapter.adaptFromApi(response)));
  }

  // Update or create monitor
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

  // delete monitor
  deleteMonitor(id: number): Observable<any> {
    return this.squacApi.delete(this.url, id);
  }
}
