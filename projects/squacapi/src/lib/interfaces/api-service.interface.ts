import { Observable } from "rxjs";

/**
 * Api service for list endpoint
 *
 * @template T model type
 */
export interface ListService<T> {
  list(params?: unknown, refresh?: boolean): Observable<Array<T>>;
}

/**
 * Api service for read endpoint
 *
 * @template T model type
 */
export interface ReadService<T> {
  read(id: number, refresh?: boolean): Observable<T>;
}

/**
 * Api service for update endpoint
 *
 * @template T model type
 */
export interface UpdateService<T> {
  update(t: T, mapId?: boolean): Observable<T | number>;
}

/**
 * Api service for write endpoint
 *
 * @template T model type
 */
export interface WriteService<T> {
  updateOrCreate(t: T, mapId?: boolean): Observable<T | number>;
}

/**
 * Api service for delete endpoint
 *
 * @template T model type
 */
export interface DeleteService<T> {
  delete(id: number): Observable<any>;
  updateOrDelete(objects: T[], ids: number[]): Observable<number>[];
}

/**
 * Api service for partial update endpoint
 *
 * @template T model type
 */
export interface PartialUpdateService<T> {
  partialUpdate(
    object: Partial<T>,
    keys: string[],
    mapId?: boolean
  ): Observable<T | number>;
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
