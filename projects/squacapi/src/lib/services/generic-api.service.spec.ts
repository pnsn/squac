import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { Observable } from "rxjs";
import {
  BaseModel,
  PartialUpdateService,
  SquacApiService,
} from "../interfaces";
import { BaseWriteableApiService } from "./generic-api.service";

interface TestModelListParams {
  id: number;
}
class TestModel extends BaseModel {}
class TestService extends BaseWriteableApiService<TestModel> {}
interface TestService
  extends SquacApiService<TestModel>,
    PartialUpdateService<BaseModel> {
  read(id: number, refresh?: boolean): Observable<TestModel>;
  list(
    params?: TestModelListParams,
    refresh?: boolean
  ): Observable<TestModel[]>;
  updateOrCreate(t: TestModel): Observable<number>;
  delete(id: number): Observable<any>;
  updateOrDelete(t: TestModel[], ids: number[]): Observable<number>[];
  partialUpdate(
    t: Partial<TestModel>,
    keys: string[],
    mapId?: boolean
  ): Observable<number | TestModel>;
}

describe("MetricService", () => {
  beforeEach(() => {
    return MockBuilder(TestService, ApiService);
  });

  it("should be created", () => {
    const service = TestBed.inject(TestService);
    expect(service).toBeDefined();
  });

  it("should be able to read", () => {});

  // can deserialize
  // can perform read erquest
  //can perfomr list request
  // can perform write request
  // can perform updateRequest
  // can perform updateDelete Request
  // can perform Delete request
  // can perform partial update
});
