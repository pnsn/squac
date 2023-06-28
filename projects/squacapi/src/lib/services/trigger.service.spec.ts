import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { TriggerService } from "./trigger.service";

describe("TriggerService", () => {
  beforeEach(() => {
    return MockBuilder(TriggerService, ApiService).mock(ApiService);
  });
  it("should be created", () => {
    const service = TestBed.inject(TriggerService);
    expect(service).toBeTruthy();
  });
});
