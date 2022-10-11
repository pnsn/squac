import { Observable } from "rxjs";

export interface GenericApiService<T> {
  create?(a: T): Observable<T>;
  delete?(id: number): Observable<any>;
  update?(a: T): Observable<T>;
  list?(params?: any): Observable<Array<T>>;
  read?(id: number): Observable<T>;
  updateOrCreate?(a: T): Observable<T>;
}
