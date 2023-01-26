import { HttpResponse, HttpContext } from "@angular/common/http";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { map, Observable } from "rxjs";
import {
  BaseModel,
  modelConstructor,
  ReadOnlyResourceModel,
} from "../interfaces";
import { ApiEndpoint, ApiEndpointToClass, getKlass } from "../enums";
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

export interface ReadParams {
  id: number;
}

export interface DeleteParams {
  id: number;
}

export interface UpdateParams {
  id: number;
  data: any;
}

export interface CreateParams {
  data: any;
}

/**
 *
 */
export abstract class BaseReadOnlyApiService<T extends BaseModel> {
  observe = "body";
  reportProgress = false;
  klass;
  constructor(protected apiEndpoint: ApiEndpoint, protected api: ApiService) {
    this.klass = getKlass<T>(this.apiEndpoint);
  }

  /**
   * Convert api object to model
   *
   * @template T model type
   * @param apiData api item
   * @returns model
   */
  protected deserialize(apiData: any): T {
    return modelConstructor(this.klass, apiData);
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
    ).pipe(map((r: Array<any>) => r.map(this.deserialize.bind(this))));
  }

  /**
   * Request single object detail of type T from squacapi
   *
   * @template T type of model to be requested
   * @param params  http params for request
   * @param options - http options for request
   * @returns - results of http request
   */
  protected _read(params?: ReadParams, options?: Options): Observable<T> {
    const httpOptions = this.getHttpOptions(options);
    return this.api[`${this.apiEndpoint}Read`](
      params,
      this.observe,
      this.reportProgress,
      httpOptions
    ).pipe(map(this.deserialize.bind(this)));
  }

  /**
   * Create read request
   *
   * @param id id of object to request
   * @param refresh refresh request
   * @returns observable for request
   */
  protected read(id: number, refresh?: boolean): Observable<T> {
    return this._read({ id }, { refresh });
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
  protected _update(params?: UpdateParams): Observable<T> {
    return this.api[`${this.apiEndpoint}Update`](
      params,
      this.observe,
      this.reportProgress
    ).pipe(map(this.deserialize.bind(this)));
  }

  /**
   * Create objects of type T from squacapi
   *
   * @template T type of model to be created
   * @param params  http params for request
   * @returns results of http request
   */
  protected _create(params?: CreateParams): Observable<T> {
    return this.api[`${this.apiEndpoint}Create`](
      params,
      "response",
      this.reportProgress
    ).pipe(
      map((response: HttpResponse<any>) => {
        return response.body;
      }),
      map(this.deserialize.bind(this))
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
      const data = t.toJson();
      const params = { id: t.id, data };
      return this._update(params);
    }
    const params = {
      data: t.toJson(),
    };
    return this._create(params);
  }

  /**
   * Delete object of type T from squacapi
   *
   * @template T type of model to be deleted
   * @param params  http params for request
   * @returns results of http request
   */
  protected _delete(params?: DeleteParams): Observable<T> {
    return this.api[`${this.apiEndpoint}Delete`](
      params,
      this.observe,
      this.reportProgress
    );
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
    const params = { id };
    return this._delete(params);
  }
}
