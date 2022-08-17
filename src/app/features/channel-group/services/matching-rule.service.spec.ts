import { TestBed } from "@angular/core/testing";

import { MatchingRuleService } from "./matching-rule.service";

describe("MatchingRuleService", () => {
  let service: MatchingRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchingRuleService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
