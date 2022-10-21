import { Observable, of } from "rxjs";

export abstract class SquacModel {
  static app: string;
  static model: string;
  static serialize?: (t: any) => string;
  static deserialize: (s: string) => any;
  // id?: number;
}

export class Test extends SquacModel {
  static app: "Test";
  static model: "Tests";
  value: string;

  static serialize(t: Test): string {
    return JSON.stringify(t);
  }
  static deserialize(s: string): Test {
    return new Test();
  }
}

export interface TestTestsListRequestParams {
  id?: string;
}
export interface TestTestsReadRequestParams {
  id: string;
}
export interface TestTestsCreateRequestParams {
  id: string;
  data: any;
}

export interface ReadOnlyTestSerializer {
  id: string;
  value: string;
}

export interface WriteOnlyTestSerializer {
  id: string;
  value: string;
}

export class TestApiService {
  testTestList(
    _params: TestTestsListRequestParams
  ): Observable<ReadOnlyTestSerializer[]> {
    return of([
      {
        id: "1",
        value: "Test value",
      },
    ]);
  }

  testTestRead(
    _params: TestTestsReadRequestParams
  ): Observable<ReadOnlyTestSerializer> {
    return of({
      id: _params.id,
      value: "Test value",
    });
  }
}
