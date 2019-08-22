import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

// Generic class for interacting with squac api
export class SquacApiService {

  protected baseUrl : string;st

  constructor (
    private url: string, 
    protected http: HttpClient
  ) {
    this.baseUrl = environment.apiUrl;
    console.log("baseUrl", this.baseUrl)
  }

  get( id ? : number ) {
    let url = this.baseUrl + this.url + (id ? id : "");
    return this.http.get<any>( url );
  }

  post(data, id? : number ) {
    let url = this.baseUrl + this.url + (id ? id : "");
    return this.http.post<any>( url, data );
  }

  put() {

  }

  delete() {

  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
  
}
