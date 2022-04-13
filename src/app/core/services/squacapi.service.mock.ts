import { Observable, of } from "rxjs";
// Used to test services that use the squac api class
export class MockSquacApiService {
  protected baseUrl: string;
  protected version: string;

  constructor(private testData?: any) {}

  get(_path: string, id?: number, _params?: any): Observable<any> {
    return of(id ? this.testData : [this.testData]);
  }

  post(_path: string, _data: any): Observable<any> {
    return of(this.testData);
  }

  put(_path: string, _id: number, _data: any): Observable<any> {
    return of(this.testData);
  }

  patch(_path: string, _id: number, _data: any): Observable<any> {
    return of(this.testData);
  }

  delete() {
    return of(this.testData);
  }
}
