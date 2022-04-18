import { Injectable } from "@angular/core";
import { Params } from "@angular/router";
import { SquacApiService } from "@core/services/squacapi.service";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Alert, AlertAdapter } from "../models/alert";

@Injectable({
  providedIn: "root",
})
export class AlertsService {
  localAlerts: { [monitorId: number]: Alert[] } = {};
  alerts: Subject<Alert[]> = new Subject();
  refreshTimeout;

  private url = "measurement/alerts/";

  constructor(
    private squacApi: SquacApiService,
    private alertAdapter: AlertAdapter
  ) {}

  getAlerts(params?: Params): Observable<Alert[]> {
    return this.squacApi
      .get(this.url, null, params)
      .pipe(
        map((results) => results.map((r) => this.alertAdapter.adaptFromApi(r)))
      );
  }

  getAlert(id: number): Observable<Alert> {
    return this.squacApi
      .get(this.url, id)
      .pipe(map((response) => this.alertAdapter.adaptFromApi(response)));
  }
}
