import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder, MockInstance, MockRender } from "ng-mocks";
import { of } from "rxjs";
import { ChannelGroup } from "squacapi";
import { ChannelGroupService } from "./channel-group.service";

describe("ChannelGroupService", () => {
  const testGroups: ChannelGroup[] = [
    new ChannelGroup({ share_all: true, share_org: true }),
    new ChannelGroup({ share_all: false, share_org: true }),
    new ChannelGroup({ share_all: false, share_org: false }),
  ];
  beforeEach(() => {
    return MockBuilder(ChannelGroupService, ApiService);
  });

  it("should be created", () => {
    const service: ChannelGroupService = TestBed.inject(ChannelGroupService);
    expect(service).toBeDefined();
  });

  it("should sort channelGroups", () => {
    const service: ChannelGroupService = TestBed.inject(ChannelGroupService);
    const listSpy = spyOn(service, "list").and.returnValue(of(testGroups));

    service.getSortedChannelGroups().subscribe((results) => {
      expect(listSpy).toHaveBeenCalled();
      expect(results.length).toBe(3);
      expect(results[0]).toEqual({
        name: "Private Groups",
        groups: [testGroups[2]],
      });
    });
  });
});
