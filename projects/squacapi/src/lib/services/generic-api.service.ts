import { HttpContext } from "@angular/common/http";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { map, Observable } from "rxjs";
import {
  BaseModel,
  CreateParams,
  DeleteParams,
  HttpOptions,
  modelConstructor,
  Options,
  Params,
  PartialUpdateParams,
  ReadParams,
  ReadSerializer,
  UpdateParams,
} from "../interfaces";
import { ApiEndpoint, getKlass } from "../enums";
import { REFRESH_REQUEST } from "../constants/refresh-request.constant";
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
   * Make http request
   *
   * @param request request type
   * @param options request options
   * @param params request params
   * @returns Observable of request response
   */
  private readHttpRequest(
    request: "List" | "Read",
    options?: Options,
    params?: Params | ReadParams
  ): Observable<T | T[]> {
    const httpOptions = this.getHttpOptions(options);
    return this.api[`${this.apiEndpoint}${request}`](
      params,
      this.observe,
      this.reportProgress,
      httpOptions
    ).pipe(
      map((response: Array<ReadSerializer> | ReadSerializer) => {
        if (Array.isArray(response)) {
          return response.map(this.deserialize.bind(this));
        } else {
          return this.deserialize(response);
        }
      })
    );
  }

  /**
   * Create read request
   *
   * @param id id of object to request
   * @param refresh refresh request
   * @returns observable for request
   */
  protected read(id: number, refresh?: boolean): Observable<T> {
    let params;
    if (id) {
      params = { id };
    }
    return this.readHttpRequest("Read", { refresh }, params) as Observable<T>;
  }

  /**
   * Returns list of requested data type
   *
   * @param params request params
   * @param refresh true if cache should not be used
   * @returns observable of list of results
   */
  protected list(params: unknown = {}, refresh?: boolean): Observable<T[]> {
    return this.readHttpRequest("List", { refresh }, params) as Observable<T[]>;
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

  private writeHttpRequest(
    request: "Update" | "Create" | "PartialUpdate" | "Delete",
    mapId: boolean,
    params?: CreateParams | UpdateParams | PartialUpdateParams | DeleteParams
  ): Observable<T | number> {
    return this.api[`${this.apiEndpoint}${request}`](
      params,
      this.observe,
      this.reportProgress
    ).pipe(
      map((response: ReadSerializer) => {
        if (request === "Delete") {
          return response;
        } else if (mapId && response.id) {
          return response.id;
        } else {
          return this.deserialize(response);
        }
      })
    );
  }

  /**
   * Create or update object of type T from squacapi
   *
   * @template T type of model to be created
   * @param t http params for request
   * @param mapId map response to id, if false returns object
   * @returns results of http request
   */
  protected updateOrCreate(t: T, mapId = true): Observable<T | number> {
    if (t.id) {
      const data = t.toJson();
      const params = { id: t.id, data };
      return this.writeHttpRequest("Update", mapId, params);
    }
    let data;
    try {
      data = t.toJson();
    } catch {
      data = this.deserialize(t).toJson();
    }
    const params = {
      data,
    };
    return this.writeHttpRequest("Create", mapId, params);
  }

  /**
   * Creates array of observables for updateing or deleting multiple
   *
   * @param objects array of objects to update or create
   * @param deleteIds ids of objects to delete
   * @returns observable of requests
   */
  protected updateOrDelete(
    objects: T[],
    deleteIds: number[]
  ): Observable<number>[] {
    const subs: Observable<number>[] = [];
    for (const obj of objects) {
      subs.push(this.updateOrCreate(obj) as Observable<number>);
    }
    for (const id of deleteIds) {
      subs.push(this.delete(id));
    }
    return subs;
  }

  /**
   * Create delete request
   *
   * @param id id of object to delete
   * @returns delete request
   */
  protected delete(id: number): Observable<any> {
    const params = { id };
    return this.writeHttpRequest("Delete", false, params);
  }

  /**
   * Builds partial update params from keys
   *
   * @param object object being updates
   * @param keys keys to update
   * @returns params
   */
  protected _partialUpdateParams(
    object: Partial<T>,
    keys: string[]
  ): PartialUpdateParams {
    const data = {};
    const objectJson = object.toJson();
    keys.forEach((key) => {
      data[key] = objectJson[key];
    });

    return {
      id: object.id,
      data,
    };
  }

  /**
   *  Partial update request for an object
   *
   * @param object object to update
   * @param keys keys being changed
   * @param mapId true if id should be returned
   * @returns id of changed object or updated object
   */
  protected partialUpdate(
    object: Partial<T>,
    keys: string[],
    mapId = true
  ): Observable<T | number> {
    const params = this._partialUpdateParams(object, keys);
    return this.writeHttpRequest("PartialUpdate", mapId, params);
  }
}
