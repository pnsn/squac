import { HttpResponse } from "@angular/common/http";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { CacheService } from "@squacapi/services/cache.service";
import { map, Observable } from "rxjs";
import { Adapter } from "./adapter";
import { SquacObject } from "./squac-object";

/**
 * Describes methods that can exist on api service
 * @typeParam T - generic object
 * */

export interface ListOnlyApiService<T> {
  listParams(params: any): any;
  list(params?: any): Observable<Array<T>>;
}

export interface ReadOnlyApiService<T> extends ListOnlyApiService<T> {
  readParams(id: any): any;
  read?(id: number): Observable<T>;
}

export interface WriteApiService<T> extends ReadOnlyApiService<T> {
  createParams(data: any): any;
  create(t: T): Observable<T>;
  updateParams(data: any): any;
  update?(t: T): Observable<T>;
  updateOrCreate?(a: T): Observable<T>;
}

export interface GenericApiService<T> extends WriteApiService<T> {
  deleteParams(id: any): any;
  delete?(id: number): Observable<any>;
}

abstract class BaseApiService<T> {
  private observe = "body";
  private reportProgress = false;

  protected adapter: Adapter<T>;

  constructor(protected modelPath: string, protected api: ApiService) {}
  protected store(url, body) {
    //cache by thiny
  }

  protected _list(params?: any): Observable<Array<any>> {
    return this.api[`${this.modelPath}List`](
      params,
      this.observe,
      this.reportProgress
    );
  }

  protected _read(params: any): Observable<any> {
    return this.api[`${this.modelPath}Read`](
      params,
      this.observe,
      this.reportProgress
    );
  }

  protected _update(params: any): Observable<any> {
    return this.api[`${this.modelPath}Update`](
      params,
      this.observe,
      this.reportProgress
    );
  }

  protected _create(params: any): Observable<any> {
    return this.api[`${this.modelPath}Create`](
      params,
      this.observe,
      this.reportProgress
    );
  }

  protected _delete(params: any): Observable<any> {
    return this.api[`${this.modelPath}Delete`](
      params,
      this.observe,
      this.reportProgress
    );
  }
}

export abstract class ListApiService<
  T extends SquacObject
> extends BaseApiService<T> {
  constructor(protected modelPath: string, protected api: ApiService) {
    super(modelPath, api);
  }

  //overwrite if different params needed
  protected listParams(params: any): any {
    return params;
  }

  /**
   * GET request - list of objects
   * @param params - request params, type varies by object
   * @returns observable of request results
   */
  protected list(params?: any): Observable<T[]> {
    const _params = this.listParams(params);
    return this._list(_params).pipe(
      map((r: Array<any>) => r.map(this.adapter.adaptFromApi.bind(this)))
    );
  }
}

export abstract class ReadApiService<
  T extends SquacObject
> extends ListApiService<T> {
  constructor(protected modelPath: string, protected api: ApiService) {
    super(modelPath, api);
  }

  protected readParams(id: number | string): any {
    return `${id}`;
  }

  /**
   * GET request - single object
   * @param id - id of requested resource
   * @returns observable of request result
   */
  protected read(id: string | number): Observable<T> {
    const _params = this.readParams(id);
    return this._read(_params).pipe(map(this.adapter.adaptFromApi.bind(this)));
  }
}

export abstract class UpdateApiService<
  T extends SquacObject
> extends ReadApiService<T> {
  constructor(protected modelPath: string, protected api: ApiService) {
    super(modelPath, api);
  }
  protected updateParams(data: any): any {
    return { id: `${data.id}`, data };
  }
  protected createParams(data: any): any {
    return { data };
  }

  /**
   * PUT request
   * @param t - object to update in squacapi
   * @returns observable of result of request
   */
  protected update(t: T): Observable<T> {
    const data = this.adapter.adaptToApi(t);
    const _params = this.updateParams(data);
    return this._update(_params).pipe(
      map(this.adapter.adaptFromApi.bind(this))
    );
  }

  /**
   * POST request
   * @param t - object to add to squacapi
   * @returns observable of result of request
   */
  protected create(t: T): Observable<T> {
    const data = this.adapter.adaptToApi(t);
    const _params = this.createParams(data);
    return this._create(_params).pipe(
      map(this.adapter.adaptFromApi.bind(this))
    );
  }

  /**
   * POST or PUT request
   * @param t - object to add to squacapi
   * @returns observable of result of request
   */
  protected updateOrCreate(t: T): Observable<T> {
    if (t.id) {
      return this.update(t);
    }
    return this.create(t);
  }
}

/**
 * Api Service for read requests (list only)
 * @typeParam T - type of object
 */
export abstract class SquacApiService<
  T extends SquacObject
> extends UpdateApiService<T> {
  /**
   * @param modelPath - path to squacapi model, camelCase
   * @param api - squacapi api service
   */
  constructor(protected modelPath: string, protected api: ApiService) {
    super(modelPath, api);
  }

  /**
   * Adapter to transform raw squacapi data to correct type
   * @virtual
   */
  protected adapter: Adapter<T>;

  protected deleteParams(id: number | string): any {
    return `${id}`;
  }

  /**
   * DELETE request
   * @param id - id of object to delete
   * @returns observable of result of request
   */
  protected delete(id: number): Observable<any> {
    const _params = this.deleteParams(id);
    return this._delete(_params);
  }
}
