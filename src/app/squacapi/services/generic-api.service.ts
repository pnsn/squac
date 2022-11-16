import {
  HttpResponse,
  HttpContext,
  HttpContextToken,
} from "@angular/common/http";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { map, Observable } from "rxjs";
import { Adapter, SquacObject } from "../interfaces";
import { ApiEndpoint } from "../enums";

export const REFRESH_REQUEST = new HttpContextToken<boolean>(() => false);

export abstract class BaseApiService<T extends SquacObject> {
  observe = "body";
  reportProgress = false;

  protected adapter: Adapter<T>;

  constructor(protected apiEndpoint: ApiEndpoint, protected api: ApiService) {}

  private mapFromApi(apiObject: any) {
    return this.adapter.adaptFromApi(apiObject);
  }

  private getHttpOptions(options: any) {
    const httpOptions: any = {};
    if (options && options.refresh) {
      httpOptions.context = new HttpContext().set(REFRESH_REQUEST, true);
    }
    return httpOptions;
  }

  // /**
  //  * GET request - list of objects
  //  * @param params - request params, type varies by object
  //  * @returns observable of request results
  //  */
  protected _list(params: any = {}, options: any = {}): Observable<Array<T>> {
    const httpOptions = this.getHttpOptions(options);
    return this.api[`${this.apiEndpoint}List`](
      params,
      this.observe,
      this.reportProgress,
      httpOptions
    ).pipe(map((r: Array<any>) => r.map(this.mapFromApi.bind(this))));
  }

  /**
   * GET request - single object
   * @param id - id of requested resource
   * @returns observable of request result
   */
  protected _read(params?: any, options?: any): Observable<T> {
    const httpOptions = this.getHttpOptions(options);
    return this.api[`${this.apiEndpoint}Read`](
      params,
      this.observe,
      this.reportProgress,
      httpOptions
    ).pipe(map(this.mapFromApi.bind(this)));
  }

  /**
   * PUT request
   * @param t - object to update in squacapi
   * @returns observable of result of request
   */
  protected _update(params?: any): Observable<T> {
    return this.api[`${this.apiEndpoint}Update`](
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
  protected _create(params?: any): Observable<T> {
    return this.api[`${this.apiEndpoint}Create`](
      params,
      "response",
      this.reportProgress
    ).pipe(
      map((response: HttpResponse<any>) => {
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
  protected _delete(params?: any): Observable<any> {
    return this.api[`${this.apiEndpoint}Delete`](
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

  protected read(id: number, options?: any): Observable<T> {
    const params = this.readParams(id);
    return this._read(params, options);
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
