import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { SquacApiService } from "@core/services/squacapi.service";
import { MockSquacApiService } from "@core/services/squacapi.service.mock";

import { MatchingRuleService } from "./matching-rule.service";

describe("MatchingRuleService", () => {
  let service: MatchingRuleService;

  const mockSquacApiService = new MockSquacApiService();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: SquacApiService, useValue: mockSquacApiService }],
    });
    service = TestBed.inject(MatchingRuleService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
