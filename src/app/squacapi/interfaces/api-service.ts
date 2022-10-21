import { Injectable } from "@angular/core";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { Observable, of } from "rxjs";
import { SquacModel } from "./test";
import { TestApiEndpoint, TestApiMethod } from "./test-api.spec";

@Injectable({
  providedIn: "root",
})
export class TestBaseApiService {
  observe = "body";
  reportProgress = false;

  constructor(protected api: ApiService) {}

  list<T extends SquacModel>(): Observable<T[]> {
    return of();
  }

  request(
    _method: TestApiMethod,
    _endpoint: TestApiEndpoint,
    _data: any
  ): Observable<any[]> {
    return of();
  }

  // /**
  //  * GET request - list of objects
  //  * @param params - request params, type varies by object
  //  * @returns observable of request results
  //  */
  // protected _list(params: any = {}): Observable<Array<T>> {
  //   return this.api[`${T}List`](
  //     params,
  //     this.observe,
  //     this.reportProgress
  //   ).pipe(map((r: Array<any>) => r.map(this.mapFromApi.bind(this))));
  // }

  // /**
  //  * GET request - single object
  //  * @param id - id of requested resource
  //  * @returns observable of request result
  //  */
  // protected _read(params: any): Observable<T> {
  //   return this.api[`${this.modelPath}Read`](
  //     params,
  //     this.observe,
  //     this.reportProgress
  //   ).pipe(map(this.mapFromApi.bind(this)));
  // }

  /**
   * PUT request
   * @param t - object to update in squacapi
  //  * @returns observable of result of request
  //  */
  // protected _update(params: any): Observable<T> {
  //   return this.api[`${this.modelPath}Update`](
  //     params,
  //     this.observe,
  //     this.reportProgress
  //   ).pipe(map(this.mapFromApi.bind(this)));
  // }

  // /**
  //  * POST request
  //  * @param t - object to add to squacapi
  //  * @returns observable of result of request
  //  */
  // protected _create(params: any): Observable<T> {
  //   return this.api[`${this.modelPath}Create`](
  //     params,
  //     "response",
  //     this.reportProgress
  //   ).pipe(
  //     map((response: HttpResponse<any>) => {
  //       return response.body;
  //     }),
  //     map(this.mapFromApi.bind(this))
  //   );
  // }

  // /**
  //  * DELETE request
  //  * @param id - id of object to delete
  //  * @returns observable of result of request
  //  */
  // protected _delete(params: any): Observable<any> {
  //   return this.api[`${this.modelPath}Delete`](
  //     params,
  //     this.observe,
  //     this.reportProgress
  //   );
  // }

  // /** override if different params needed */
  // protected readParams(id: number | string): any {
  //   return { id: `${id}` };
  // }

  // /** override if different params needed */
  // protected updateParams(t: T): any {
  //   const data = this.adapter.adaptToApi(t);
  //   return { id: `${t.id}`, data };
  // }

  // /** override if different params needed */
  // protected createParams(t: T): any {
  //   const data = this.adapter.adaptToApi(t);
  //   return { data };
  // }

  // /** override if different params needed */
  // protected deleteParams(id: number | string): any {
  //   return { id: `${id}` };
  // }

  // protected read(id: number): Observable<T> {
  //   const params = this.readParams(id);
  //   return this._read(params);
  // }

  // protected delete(id: number): Observable<T> {
  //   const params = this.deleteParams(id);
  //   return this._delete(params);
  // }

  // /**
  //  * POST or PUT request
  //  * @param t - object to add to squacapi
  //  * @returns observable of result of request
  //  */
  // protected _updateOrCreate(t: T): Observable<T> {
  //   if (t.id) {
  //     const params = this.updateParams(t);
  //     return this._update(params);
  //   }
  //   const params = this.createParams(t);
  //   return this._create(params);
  // }
}
