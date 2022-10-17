import { ApiService } from "@pnsn/ngx-squacapi-client";
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

export abstract class ListApiService<T extends SquacObject>
  implements GenericApiService<T>
{
  constructor(protected modelPath: string, protected api: ApiService) {}
  protected adapter: Adapter<T>;

  list(params: any = {}): Observable<T[]> {
    return this.api[`${this.modelPath}List`](params).pipe(
      map((r: Array<any>) => r.map(this.adapter.adaptFromApi.bind(this)))
    );
  }
}

// Service that allows Read only api operations
export abstract class ReadApiService<
  T extends SquacObject
> extends ListApiService<T> {
  constructor(protected modelPath: string, protected api: ApiService) {
    super(modelPath, api);
  }

  read(id: number): Observable<T> {
    const params = {
      id: `${id}`,
    };
    return this.api[`${this.modelPath}Read`](params).pipe(
      map(this.adapter.adaptFromApi.bind(this))
    );
  }
}

// Service for read & write api operations
export abstract class ReadWriteApiService<T extends SquacObject>
  extends ReadApiService<T>
  implements GenericApiService<T>
{
  constructor(protected modelPath: string, protected api: ApiService) {
    super(modelPath, api);
  }

  update(t: T): Observable<T> {
    const params = {
      id: `${t.id}`,
      data: this.adapter.adaptToApi(t),
    };
    return this.api[`${this.modelPath}Update`](params).pipe(
      map(this.adapter.adaptFromApi.bind(this))
    );
  }

  create(t: T): Observable<T> {
    const params = {
      data: this.adapter.adaptToApi(t),
    };
    return this.api[`${this.modelPath}Create`](params).pipe(
      map(this.adapter.adaptFromApi.bind(this))
    );
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
   * @param requestParameters - request params for object type
   */
  constructor(protected modelPath: string, protected api: ApiService) {
    super(modelPath, api);
  }

  // delete object with given id
  delete(id: number): Observable<any> {
    const params = {
      id: `${id}`,
    };
    return this.api[`${this.modelPath}Delete`](params);
  }
}
