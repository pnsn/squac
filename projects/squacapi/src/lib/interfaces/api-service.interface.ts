import { Observable } from "rxjs";

export interface ListService<T> {
  list(params?: unknown): Observable<Array<T>>;
}

export interface ReadService<T> {
  read(params: unknown): Observable<T>;
}

export interface UpdateService<T> {
  update(params: unknown): Observable<T>;
}

export interface WriteService<T> {
  updateOrCreate(t: T): Observable<T>;
}

export interface DeleteService<T> {
  delete(params: unknown): Observable<T>;
}

export interface ReadOnlyApiService<T> extends ReadService<T>, ListService<T> {}

export interface ReadUpdateApiService<T>
  extends ReadService<T>,
    UpdateService<T> {}

export interface WriteableApiService<T>
  extends ReadOnlyApiService<T>,
    WriteService<T> {}

export interface SquacApiService<T>
  extends WriteableApiService<T>,
    DeleteService<T> {}
