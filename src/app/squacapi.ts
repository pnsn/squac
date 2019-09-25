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
  protected baseUrl : string;

  constructor (
    private http: HttpClient
  ) {
    this.baseUrl = environment.apiUrl;
  }
  //TODO test



  // http get with optional id & params
  get( path : string , id ? : number, params?: Params ) : Observable<any> {
    let url = this.baseUrl + path + (id ? id : "");
    return this.http.get<any>( url , {
      params: params
    });
  }

  // http post with data
  post(path : string, data : any) : Observable<any> {
    let url = this.baseUrl + path;
    return this.http.post<any>(url, data );
  }

  // for updating 
  put(path : string, id: number, data: any ) : Observable<any>{
    let url = this.baseUrl + path + (id ? id + "/" : "");
    return this.http.put<any>(url, data);
  }

  delete() {

  }
  
}
