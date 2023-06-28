import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";
import { MatchingRule } from "../models";
import { ChannelService } from "./channel.service";

describe("ChannelService", () => {
  beforeEach(() => {
    return MockBuilder(ChannelService, ApiService);
  });

  it("should be created", () => {
    const service: ChannelService = TestBed.inject(ChannelService);
    expect(service).toBeTruthy();
  });

  it("should get channels with filters", () => {
    const service: ChannelService = TestBed.inject(ChannelService);
    spyOn(service, "list").and.returnValue(of());

    const rules: MatchingRule[] = [
      new MatchingRule({
        isInclude: true,
        networkRegex: "net",
      }),
      new MatchingRule({
        isInclude: true,
      }),
      new MatchingRule({ isInclude: false, stationRegex: "sta" }),
    ];
    const ruleSubs = service.getChannelsByRules(rules);
    expect(ruleSubs.length).toBe(2);
  });
});
