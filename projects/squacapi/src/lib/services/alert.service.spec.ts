import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { AlertService } from "./alert.service";

describe("AlertService", () => {
  beforeEach(() => {
    return MockBuilder(AlertService, ApiService);
  });

  it("should be created", () => {
    const service = TestBed.inject(AlertService);
    expect(service).toBeTruthy();
  });
});
