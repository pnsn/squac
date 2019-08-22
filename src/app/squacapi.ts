import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

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

  get( id ? : number ) {
    let url = this.baseUrl + this.url + (id ? id : "")
    return this.http.get<any>( url );
  }

  post(data) {
    return this.http.post<any>(
      this.baseUrl + this.url,
      data
    )
  }

  put() {

  }

  delete() {

  }
}
