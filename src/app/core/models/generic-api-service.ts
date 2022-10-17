import { ApiService } from "@pnsn/ngx-squacapi-client";
import { map, Observable } from "rxjs";
import { Adapter } from "./adapter";

/**
 * Base squacapi object
 */
export interface SquacObject {
  id?: number;
}

/**
 * Describes methods that can exist on api service
 * @typeParam T - generic object
 * */
export interface GenericApiService<T> {
  create?(t: T): Observable<T>;
  delete?(id: number): Observable<any>;
  update?(t: T): Observable<T>;
  list?(params?: any): Observable<Array<T>>;
  read?(id: number): Observable<T>;
  updateOrCreate?(a: T): Observable<T>;
}

/**
 * Api Service for read requests (list only)
 * @typeParam T - type of object
 */
export abstract class ListApiService<T extends SquacObject>
  implements GenericApiService<T>
{
  /**
   * @param modelPath - path to squacapi model, camelCase
   * @param api - squacapi api service
   */
  constructor(protected modelPath: string, protected api: ApiService) {}

  /**
   * Adapter to transform raw squacapi data to correct type
   * @virtual
   */
  protected adapter: Adapter<T>;

  /**
   * GET request - list of objects
   * @param params - request params, type varies by object
   * @returns observable of request results
   */
  list(params: any = {}): Observable<T[]> {
    return this.api[`${this.modelPath}List`](params).pipe(
      map((r: Array<any>) => r.map(this.adapter.adaptFromApi.bind(this)))
    );
  }
}

/**
 * Api Service for read requests
 * @typeParam T - type of object
 */
export abstract class ReadApiService<
  T extends SquacObject
> extends ListApiService<T> {
  /**
   * @param modelPath - path to squacapi model, camelCase
   * @param api - squacapi api service
   */
  constructor(protected modelPath: string, protected api: ApiService) {
    super(modelPath, api);
  }

  /**
   * GET request - single object
   * @param id - id of requested resource
   * @returns observable of request result
   */
  read(id: number): Observable<T> {
    const params = {
      id: `${id}`,
    };
    return this.api[`${this.modelPath}Read`](params).pipe(
      map(this.adapter.adaptFromApi.bind(this))
    );
  }
}

/**
 * Api Service for read, write and update requests
 * @typeParam T - type of object
 */
export abstract class ReadWriteApiService<T extends SquacObject>
  extends ReadApiService<T>
  implements GenericApiService<T>
{
  /**
   * @param modelPath - path to squacapi model, camelCase
   * @param api - squacapi api service
   */
  constructor(protected modelPath: string, protected api: ApiService) {
    super(modelPath, api);
  }

  /**
   * PUT request
   * @param t - object to update in squacapi
   * @returns observable of result of request
   */
  update(t: T): Observable<T> {
    const params = {
      id: `${t.id}`,
      data: this.adapter.adaptToApi(t),
    };
    return this.api[`${this.modelPath}Update`](params).pipe(
      map(this.adapter.adaptFromApi.bind(this))
    );
  }

  /**
   * POST request
   * @param t - object to add to squacapi
   * @returns observable of result of request
   */
  create(t: T): Observable<T> {
    const params = {
      data: this.adapter.adaptToApi(t),
    };
    return this.api[`${this.modelPath}Create`](params).pipe(
      map(this.adapter.adaptFromApi.bind(this))
    );
  }

  /**
   * POST or PUT request
   * @param t - object to add to squacapi
   * @returns observable of result of request
   */
  updateOrCreate(t: T): Observable<T> {
    if (t.id) {
      return this.update(t);
    }
    return this.create(t);
  }
}

/**
 * Api Service for read, write, update, and delete requests
 * @typeParam T - type of object
 */
export abstract class ReadWriteDeleteApiService<T extends SquacObject>
  extends ReadWriteApiService<T>
  implements GenericApiService<T>
{
  /**
   * @param modelPath - path to squacapi model, camelCase
   * @param api - squacapi api service
   */
  constructor(protected modelPath: string, protected api: ApiService) {
    super(modelPath, api);
  }

  /**
   * DELETE request
   * @param id - id of object to delete
   * @returns observable of result of request
   */
  delete(id: number): Observable<any> {
    const params = {
      id: `${id}`,
    };
    return this.api[`${this.modelPath}Delete`](params);
  }
}
