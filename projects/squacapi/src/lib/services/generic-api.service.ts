import { HttpResponse, HttpContext } from "@angular/common/http";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { map, Observable } from "rxjs";
import { BaseModel } from "../interfaces";
import { ApiEndpoint } from "../enums";
import { REFRESH_REQUEST } from "../constants/refresh-request.constant";

/**
 * Options for requests
 */
export interface Options {
  /** if true, will not use the cache */
  refresh?: boolean;
}

/** HttpOptions for requests */
export interface HttpOptions {
  /** Http context */
  context?: HttpContext;
}

export type Params = any;

/**
 *
 */
export abstract class BaseReadOnlyApiService<T extends BaseModel> {
  observe = "body";
  reportProgress = false;
  constructor(protected apiEndpoint: ApiEndpoint, protected api: ApiService) {}

  /**
   * Convert api object to model
   *
   * @template T model type
   * @param apiData api item
   * @returns model
   */
  protected deserialize(ctor: { new (data: any): T }, apiData: any): T {
    return new ctor(apiData);
  }

  /**
   * Adds context to options
   *
   * @param options request options
   * @returns options with context
   */
  protected getHttpOptions(options: Options): HttpOptions {
    const httpOptions: HttpOptions = {};
    if (options && options.refresh) {
      httpOptions.context = new HttpContext().set(REFRESH_REQUEST, true);
    }
    return httpOptions;
  }

  /**
   * Request list of objects of type T from squacapi
   *
   * @template T type of model to be requested
   * @param params  http params for request
   * @param options - http options for request
   * @returns results of http request
   */
  protected _list(
    params: Params = {},
    options: Options = {}
  ): Observable<Array<T>> {
    const httpOptions = this.getHttpOptions(options);
    return this.api[`${this.apiEndpoint}List`](
      params,
      this.observe,
      this.reportProgress,
      httpOptions
    ).pipe(map((r: Array<any>) => r.map(this.deserialize)));
  }

  /**
   * Request single object detail of type T from squacapi
   *
   * @template T type of model to be requested
   * @param params  http params for request
   * @param options - http options for request
   * @returns - results of http request
   */
  protected _read(params?: Params, options?: Options): Observable<T> {
    const httpOptions = this.getHttpOptions(options);
    return this.api[`${this.apiEndpoint}Read`](
      params,
      this.observe,
      this.reportProgress,
      httpOptions
    ).pipe(map(this.deserialize));
  }

  /**
   * Convert inputted id to correct param format for squacapi
   *
   * @param id - id of object
   * @returns id params
   */
  protected readParams(id: number | string): { id: string | number } {
    return { id: `${id}` };
  }

  /**
   * Create read request
   *
   * @param id id of object to request
   * @param refresh refresh request
   * @returns observable for request
   */
  protected read(id: number, refresh?: boolean): Observable<T> {
    const params = this.readParams(id);
    return this._read(params, { refresh });
  }

  /**
   * Returns list of requested data type
   *
   * @param params request params
   * @param refresh true if cache should not be used
   * @returns observable of list of results
   */
  protected list(params?: unknown, refresh?: boolean): Observable<T[]> {
    return this._list(params, { refresh });
  }
}

/**
 * Abstract service for interacting with squacapi models
 *
 * @template T model type
 */
export abstract class BaseWriteableApiService<
  T extends BaseModel
> extends BaseReadOnlyApiService<T> {
  constructor(override apiEndpoint: ApiEndpoint, override api: ApiService) {
    super(apiEndpoint, api);
  }

  /**
   * Update single object of type T from squacapi
   *
   * @template T type of model to be updated
   * @param params  http params for request
   * @returns results of http request
   */
  protected _update(params?: Params): Observable<T> {
    return this.api[`${this.apiEndpoint}Update`](
      params,
      this.observe,
      this.reportProgress
    ).pipe(map(this.deserialize));
  }

  /**
   * Create objects of type T from squacapi
   *
   * @template T type of model to be created
   * @param params  http params for request
   * @returns results of http request
   */
  protected _create(params?: Params): Observable<T> {
    return this.api[`${this.apiEndpoint}Create`](
      params,
      "response",
      this.reportProgress
    ).pipe(
      map((response: HttpResponse<any>) => {
        return response.body;
      }),
      map(this.deserialize)
    );
  }

  /**
   * Create or update object of type T from squacapi
   *
   * @template T type of model to be created
   * @param t http params for request
   * @returns results of http request
   */
  protected _updateOrCreate(t: T): Observable<T> {
    if (t.id) {
      const params = this.updateParams(t);
      return this._update(params);
    }
    const params = this.createParams(t);
    return this._create(params);
  }

  /**
   * Delete object of type T from squacapi
   *
   * @template T type of model to be deleted
   * @param params  http params for request
   * @returns results of http request
   */
  protected _delete(params?: Params): Observable<T> {
    return this.api[`${this.apiEndpoint}Delete`](
      params,
      this.observe,
      this.reportProgress
    );
  }

  /**
   * Formats inputted object for squacapi
   *
   * @template T type of object to update
   * @param t object to update
   * @returns returns data object
   */
  protected updateParams(t: T): { id: string | number; data: unknown } {
    const data = t.toJson();
    return { id: `${t.id}`, data };
  }

  /**
   * Formats inputted object for squacapi
   *
   * @template T type of object to create
   * @param t object to create
   * @returns returns data object
   */
  protected createParams(t: T): { data: unknown } {
    const data = t.toJson();
    return { data };
  }

  /**
   * Convert inputted id to correct param format for squacapi
   *
   * @param id  id of object
   * @returns id params
   */
  protected deleteParams(id: number | string): { id: string | number } {
    return { id: `${id}` };
  }

  /**
   * Create or update object of type T from squacapi
   *
   * @template T type of model to be created
   * @param t http params for request
   * @returns results of http request
   */
  protected updateOrCreate(t: T): Observable<T> {
    return this._updateOrCreate(t);
  }

  /**
   * Create delete request
   *
   * @param id id of object to delete
   * @returns delete request
   */
  protected delete(id: number): Observable<T> {
    const params = this.deleteParams(id);
    return this._delete(params);
  }
}
