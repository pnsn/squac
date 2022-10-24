import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { TriggerService } from "./trigger.service";

describe("TriggerService", () => {
  let service: TriggerService;

  beforeEach(() => {
    return MockBuilder(TriggerService).mock(ApiService);
  });
  beforeEach(() => {
    service = TestBed.inject(TriggerService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
