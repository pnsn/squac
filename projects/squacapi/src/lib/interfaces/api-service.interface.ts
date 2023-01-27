import { Observable } from "rxjs";

/**
 * Api service for list endpoint
 *
 * @template T model type
 */
export interface ListService<T> {
  /**
   * Requests list of data
   *
   * @template T model type
   * @param params request params
   * @returns observable of results
   */
  list(params?: unknown): Observable<Array<T>>;
}

/**
 * Api service for read endpoint
 *
 * @template T model type
 */
export interface ReadService<T> {
  /**
   * Requests single item of data
   *
   * @template T model type
   * @param params request params
   * @returns observable of results
   */
  read(params: unknown): Observable<T>;
}

/**
 * Api service for update endpoint
 *
 * @template T model type
 */
export interface UpdateService<T> {
  /**
   * Updates object
   *
   * @template T model type
   * @param params request params
   * @returns observable of results
   */
  update(params: unknown): Observable<T | number>;
}

/**
 * Api service for write endpoint
 *
 * @template T model type
 */
export interface WriteService<T> {
  /**
   * Updates or creates object
   *
   * @template T model type
   * @param params request params
   * @returns observable of results
   */
  updateOrCreate(t: T): Observable<T | number>;
}

/**
 * Api service for delete endpoint
 *
 * @template T model type
 */
export interface DeleteService<T> {
  /**
   * Deletes object
   *
   * @template T model type
   * @param params request params
   * @returns observable of results
   */
  delete(params: unknown): Observable<any>;
  updateOrDelete(objects: T[], ids: number[]): Observable<number>[];
}

/**
 * Api service for partial update endpoint
 *
 * @template T model type
 */
export interface PartialUpdateService<T> {
  /**
   * Updates object with partial data
   *
   * @template T model type
   * @param params request params
   * @returns observable of results
   */
  partialUpdate(params: unknown): Observable<T | number>;
}

/**
 * Read only api end points
 */
export interface ReadOnlyApiService<T> extends ReadService<T>, ListService<T> {}

/** Read and update api endpoints */
export interface ReadUpdateApiService<T>
  extends ReadService<T>,
    UpdateService<T> {}

/** Write and read api endpoints */
export interface WriteableApiService<T>
  extends ReadOnlyApiService<T>,
    WriteService<T> {}

/** CRUD Api service */
export interface SquacApiService<T>
  extends WriteableApiService<T>,
    DeleteService<T> {}
