import { TestBed } from "@angular/core/testing";
import { ChannelGroupService } from "../services/channel-group.service";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { WidgetAdapter } from "../models/widget";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";
import { WidgetService } from "./widget.service";

describe("WidgetService", () => {
  beforeEach(() => {
    return MockBuilder(WidgetService)
      .keep(WidgetAdapter)
      .mock(ApiService)
      .provide({
        provide: ChannelGroupService,
        useValue: {
          getChannelGroup: (_id) => {
            return of([]);
          },
        },
      });
  });

  it("should be created", () => {
    const service: WidgetService = TestBed.inject(WidgetService);
    expect(service).toBeTruthy();
  });
});
