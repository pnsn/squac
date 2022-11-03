import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MatchingRuleService } from "./matching-rule.service";

describe("MatchingRuleService", () => {
  let service: MatchingRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: {} }],
    });
    service = TestBed.inject(MatchingRuleService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
