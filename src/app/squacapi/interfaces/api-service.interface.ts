import { Observable } from "rxjs";

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
