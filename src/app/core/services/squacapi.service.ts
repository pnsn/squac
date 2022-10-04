import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Params } from "@angular/router";
import { Injectable } from "@angular/core";
import { map } from "rxjs";

export enum SquacApps {
  User = "user/",
  Organization = "organization/",
  Nslc = "nslc/",
  Dashboard = "dashboard/",
  Measurement = "measurement/",
  PasswordReset = "password_reset/",
  Invite = "invite/",
}
export enum SquacUrls {
  UserToken = SquacApps.User + "token/",
  UserNew = SquacApps.User + "new/",
  UserMe = SquacApps.User + "me/",
  OrganizationOrganizations = SquacApps.Organization + "organizations/",
  OrganizationUsers = SquacApps.Organization + "users/",
  PasswordReset = SquacApps.PasswordReset,
  PasswordResetValidateToken = SquacApps.PasswordReset + "validate_token/",
  PasswordResetConfirm = SquacApps.PasswordReset + "confirm/",
  NslcGroups = SquacApps.Nslc + "groups/",
  NslcChannels = SquacApps.Nslc + "channels/",
  NslcMatchingRules = SquacApps.Nslc + "matching-rules/",
  NslcNetworks = SquacApps.Nslc + "networks/",
  DashboardDashboards = SquacApps.Dashboard + "dashboards/",
  DashboardWidgets = SquacApps.Dashboard + "widgets/",
  MeasurementMetrics = SquacApps.Measurement + "metrics/",
  MeasurementMonitors = SquacApps.Measurement + "monitors/",
  MeasurementTriggers = SquacApps.Measurement + "triggers/",
  MeasurementAlerts = SquacApps.Measurement + "alerts/",
  MeasurementMeasurements = SquacApps.Measurement + "measurements/",
  MeasurementHourArchives = SquacApps.Measurement + "hour-archives/",
  MeasurementDayArchives = SquacApps.Measurement + "day-archives/",
  MeasurementWeekArchives = SquacApps.Measurement + "week-archives/",
  MeasurementMonthArchives = SquacApps.Measurement + "month-archives/",
  MeasurementAggregated = SquacApps.Measurement + "aggregated/",
  InviteInvite = SquacApps.Invite + "invite/",
  InviteRegister = SquacApps.Invite + "register/",
}
// Generic class for interacting with squac api
@Injectable({
  providedIn: "root",
})
export class SquacApiService {
  protected baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl + environment.version;
  }

  // return full url for request
  private url(path: string, id?: number): string {
    return this.baseUrl + path + (id ? id + "/" : "");
  }

  // http get with optional id & params
  get(path: string, id?: number, params?: Params): Observable<any | any[]> {
    return this.http
      .get<any>(this.url(path, id), {
        params,
        observe: "response",
      })
      .pipe(
        map((resp) => {
          console.log(resp.url);
          return resp.body;
        })
      );
  }

  // http post with data
  post(path: string, data: any): Observable<any> {
    return this.http.post<any>(this.url(path), data);
  }

  // for updating
  put(path: string, id: number, data: any): Observable<any> {
    return this.http.put<any>(this.url(path, id), data);
  }

  // for updating
  patch(path: string, id: number, data: any): Observable<any> {
    return this.http.patch<any>(this.url(path, id), data);
  }

  // for deleting
  delete(path: string, id: number) {
    return this.http.delete<any>(this.url(path, id));
  }
}
