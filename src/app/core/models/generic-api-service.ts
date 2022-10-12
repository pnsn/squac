import { map, Observable } from "rxjs";
import { Adapter } from "./adapter";

// base squac object
export interface SquacObject {
  id?: number;
}

// describes an api service
export interface GenericApiService<T> {
  create?(t: T): Observable<T>;
  delete?(id: number): Observable<any>;
  update?(t: T): Observable<T>;
  list?(params?: any): Observable<Array<T>>;
  read?(id: number): Observable<T>;
  updateOrCreate?(a: T): Observable<T>;
}

// Service that allows Read only api operations
export abstract class ReadApiService<T extends SquacObject>
  implements GenericApiService<T>
{
  constructor(protected adapter: Adapter<T>) {}
  protected abstract apiList(params?: any): Observable<any>;
  protected abstract apiRead(params?: any): Observable<any>;

  list(params: any = {}): Observable<T[]> {
    return this.apiList(params).pipe(
      map((r: Array<any>) => r.map(this.adapter.adaptFromApi))
    );
  }

  read(id: number): Observable<T> {
    const params = {
      id: `${id}`,
    };
    return this.apiRead(params).pipe(map(this.adapter.adaptFromApi));
  }
}

// Service for read & write api operations
export abstract class ReadWriteApiService<T extends SquacObject>
  extends ReadApiService<T>
  implements GenericApiService<T>
{
  protected abstract apiUpdate(params?: any): Observable<any>;
  protected abstract apiCreate(params?: any): Observable<any>;
  constructor(protected adapter: Adapter<T>) {
    super(adapter);
  }

  update(t: T): Observable<T> {
    const params = {
      id: `${t.id}`,
      data: this.adapter.adaptToApi(t),
    };
    return this.apiUpdate(params).pipe(map(this.adapter.adaptFromApi));
  }

  create(t: T): Observable<T> {
    const params = {
      data: this.adapter.adaptToApi(t),
    };
    return this.apiCreate(params).pipe(map(this.adapter.adaptFromApi));
  }

  updateOrCreate(t: T): Observable<T> {
    if (t.id) {
      return this.update(t);
    }
    return this.create(t);
  }
}

// service for read, write, delete api operations
export abstract class ReadWriteDeleteApiService<T extends SquacObject>
  extends ReadWriteApiService<T>
  implements GenericApiService<T>
{
  // api delete method
  /**
   * @param requestParameters request params for object type
   */
  protected abstract apiDelete(requestParameters?: any): Observable<any>;
  constructor(protected adapter: Adapter<T>) {
    super(adapter);
  }

  // delete object with given id
  delete(id: number): Observable<any> {
    const params = {
      id: `${id}`,
    };
    return this.apiDelete(params);
  }
}
