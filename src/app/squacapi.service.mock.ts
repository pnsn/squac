import { environment } from '../environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SquacApiService } from './squacapi';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
// Used to test services that use the squac api class
export class MockSquacApiService {
  protected baseUrl : string = "baseUrl";

  constructor (
    private testData : any
  ) {
    console.log("created", testData)
  };

  get(path : string, id?: number, params? : any) : Observable<any>{
    console.log("Getme");
    return of(id ? this.testData : [this.testData]);
  }

  post(path : string, data : any) : Observable<any> {
    return of(this.testData);
  }

  put(path : string, id : number, data : any) : Observable<any> {
    return of(this.testData);
  }
}
