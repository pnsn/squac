import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { AggregateService } from "./aggregate.service";

describe("AggregateService", () => {
  let service: AggregateService;

  beforeEach(() => {
    return MockBuilder(AggregateService).mock(ApiService);
  });
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AggregateService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
