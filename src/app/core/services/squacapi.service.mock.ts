import { Observable, of } from "rxjs";
// Used to test services that use the squac api class
export class MockSquacApiService {
  protected baseUrl: string;
  protected version: string;

  constructor(private testData?: any) {}

  get(path: string, id?: number, params?: any): Observable<any> {
    return of(id ? this.testData : [this.testData]);
  }

  post(path: string, data: any): Observable<any> {
    return of(this.testData);
  }

  put(path: string, id: number, data: any): Observable<any> {
    return of(this.testData);
  }

  patch(path: string, id: number, data: any): Observable<any> {
    return of(this.testData);
  }

  delete() {
    return of(this.testData);
  }
}
