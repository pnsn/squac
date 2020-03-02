import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { Params } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
// Generic class for interacting with squac api
export class SquacApiService {
  protected baseUrl: string;
  protected version: string;

  constructor(
    private http: HttpClient
  ) {
    this.baseUrl = environment.apiUrl;
    this.version = environment.version;
  }
  // TODO test

  // http get with optional id & params
  get( path: string , id ?: number, params?: Params ): Observable<any> {
    const url = this.getBaseUrl(path) + (id ? id : '');
    return this.http.get<any>( url , {
      params
    });
  }

  // http post with data
  post(path: string, data: any): Observable<any> {
    const url = this.getBaseUrl(path);
    console.log('post: ', url);
    return this.http.post<any>(url, data );
  }

  // for updating
  put(path: string, id: number, data: any ): Observable<any> {
    const url = this.getBaseUrl(path) + (id ? id + '/' : '');
    console.log('put: ', url);
    return this.http.put<any>(url, data);
  }

  // for deleting
  delete(path: string, id: number) {
    const url = this.getBaseUrl(path) + (id ? id + '/' : '');
    return this.http.delete<any>(url);
  }

  // all routes except user are versioned
  private getBaseUrl(path: string): string {
    let url: string;
    url = this.baseUrl;
    if (!path.includes('user')) {
      url += this.version;
    }
    return url + path;
  }

}
