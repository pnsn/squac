import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Params } from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
// Generic class for interacting with squac api
export class SquacApiService {
  protected baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl + environment.version;
  }
  // TODO test

  // http get with optional id & params
  get(path: string, id?: number, params?: Params): Observable<any | any[]> {
    const url = this.baseUrl + path + (id ? id + "/" : "");
    return this.http.get<any>(url, {
      params,
    });
  }

  // http post with data
  post(path: string, data: any): Observable<any> {
    const url = this.baseUrl + path;
    return this.http.post<any>(url, data);
  }

  // for updating
  put(path: string, id: number, data: any): Observable<any> {
    const url = this.baseUrl + path + (id ? id + "/" : "");
    return this.http.put<any>(url, data);
  }

  // for updating
  patch(path: string, id: number, data: any): Observable<any> {
    const url = this.baseUrl + path + (id ? id + "/" : "");
    return this.http.patch<any>(url, data);
  }

  // for deleting
  delete(path: string, id: number) {
    const url = this.baseUrl + path + id + "/";
    return this.http.delete<any>(url);
  }
}
