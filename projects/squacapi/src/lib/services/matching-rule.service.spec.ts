import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { MatchingRuleService } from "./matching-rule.service";

describe("MatchingRuleService", () => {
  beforeEach(() => {
    return MockBuilder(MatchingRuleService, ApiService);
  });

  it("should be created", () => {
    const service = TestBed.inject(MatchingRuleService);
    expect(service).toBeDefined();
  });
});
