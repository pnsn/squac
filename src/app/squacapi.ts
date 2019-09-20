import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { Params } from '@angular/router';

// Generic class for interacting with squac api
export class SquacApiService {

  protected baseUrl : string;

  constructor (
    private url: string, 
    protected http: HttpClient
  ) {
    this.baseUrl = environment.apiUrl;
    console.log("baseUrl", this.baseUrl)
  }

  // http get with optional id & params
  get( id ? : number, params?: Params ) : Observable<any> {
    let url = this.baseUrl + this.url + (id ? id : "");
    return this.http.get<any>( url , {
      params: params
    });
  }

  // http post with data & optional id for new 
  post(data, id? : number ) : Observable<any> {
    let url = this.baseUrl + this.url + (id ? id : "");
    return this.http.post<any>(url, data );
  }

  // for updating 
  put(data, id? : number) : Observable<any>{
    let url = this.baseUrl + this.url + (id ? id + "/" : "");
    return this.http.put<any>(url, data);
  }

  delete() {

  }
  
}
