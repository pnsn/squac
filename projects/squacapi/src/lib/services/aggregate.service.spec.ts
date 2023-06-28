import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { AggregateService } from "./aggregate.service";

describe("AggregateService", () => {
  beforeEach(() => {
    return MockBuilder(AggregateService, ApiService);
  });

  it("should be created", () => {
    const service = TestBed.inject(AggregateService);
    expect(service).toBeDefined();
  });
});
