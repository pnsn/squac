import { HttpResponse } from "@angular/common/http";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { map, Observable } from "rxjs";
import { Adapter } from "./adapter";
import { SquacObject } from "./squac-object";

export interface ListService<T> {
  list(params?: any): Observable<Array<T>>;
}

export interface ReadService<T> {
  read(params: any): Observable<T>;
}

export interface WriteService<T> {
  updateOrCreate(t: T): Observable<T>;
}

export interface DeleteService<T> {
  delete(params: any): Observable<T>;
}

export interface ReadOnlyApiService<T> extends ReadService<T>, ListService<T> {}

export interface WriteableApiService<T>
  extends ReadOnlyApiService<T>,
    WriteService<T> {}

export interface SquacApiService<T>
  extends WriteableApiService<T>,
    DeleteService<T> {}

export abstract class BaseApiService<T extends SquacObject> {
  observe = "body";
  reportProgress = false;

  protected adapter: Adapter<T>;

  constructor(protected modelPath: string, protected api: ApiService) {}

  private mapFromApi(apiObject: any) {
    return this.adapter.adaptFromApi(apiObject);
  }
  // /**
  //  * GET request - list of objects
  //  * @param params - request params, type varies by object
  //  * @returns observable of request results
  //  */
  protected _list(params: any = {}): Observable<Array<T>> {
    return this.api[`${this.modelPath}List`](
      params,
      this.observe,
      this.reportProgress
    ).pipe(map((r: Array<any>) => r.map(this.mapFromApi.bind(this))));
  }

  /**
   * GET request - single object
   * @param id - id of requested resource
   * @returns observable of request result
   */
  protected _read(params: any): Observable<T> {
    return this.api[`${this.modelPath}Read`](
      params,
      this.observe,
      this.reportProgress
    ).pipe(map(this.mapFromApi.bind(this)));
  }

  /**
   * PUT request
   * @param t - object to update in squacapi
   * @returns observable of result of request
   */
  protected _update(params: any): Observable<T> {
    return this.api[`${this.modelPath}Update`](
      params,
      this.observe,
      this.reportProgress
    ).pipe(map(this.mapFromApi.bind(this)));
  }

  /**
   * POST request
   * @param t - object to add to squacapi
   * @returns observable of result of request
   */
  protected _create(params: any): Observable<T> {
    console.log("Create", params);
    return this.api[`${this.modelPath}Create`](
      params,
      "response",
      this.reportProgress
    ).pipe(
      map((response: HttpResponse<any>) => {
        console.log(response);
        return response.body;
      }),
      map(this.mapFromApi.bind(this))
    );
  }

  /**
   * DELETE request
   * @param id - id of object to delete
   * @returns observable of result of request
   */
  protected _delete(params: any): Observable<any> {
    return this.api[`${this.modelPath}Delete`](
      params,
      this.observe,
      this.reportProgress
    );
  }

  /** override if different params needed */
  protected readParams(id: number | string): any {
    return { id: `${id}` };
  }

  /** override if different params needed */
  protected updateParams(t: T): any {
    const data = this.adapter.adaptToApi(t);
    return { id: `${t.id}`, data };
  }

  /** override if different params needed */
  protected createParams(t: T): any {
    const data = this.adapter.adaptToApi(t);
    return { data };
  }

  /** override if different params needed */
  protected deleteParams(id: number | string): any {
    return { id: `${id}` };
  }

  protected read(id: number): Observable<T> {
    const params = this.readParams(id);
    return this._read(params);
  }

  protected delete(id: number): Observable<T> {
    const params = this.deleteParams(id);
    return this._delete(params);
  }

  /**
   * POST or PUT request
   * @param t - object to add to squacapi
   * @returns observable of result of request
   */
  protected _updateOrCreate(t: T): Observable<T> {
    if (t.id) {
      const params = this.updateParams(t);
      return this._update(params);
    }
    const params = this.createParams(t);
    return this._create(params);
  }
}
