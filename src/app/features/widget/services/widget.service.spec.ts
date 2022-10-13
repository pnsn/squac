import { TestBed } from "@angular/core/testing";
import { ChannelGroupService } from "@channelGroup/services/channel-group.service";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { WidgetAdapter } from "@widget/models/widget";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";
import { WidgetModule } from "../widget.module";
import { WidgetService } from "./widget.service";

describe("WidgetService", () => {
  const testData = {
    id: 1,
    name: "string",
    dashboard: {},
    description: "desc",
    widgettype: {},
    metrics: [],
    thresholds: [],
    columns: 1,
    rows: 1,
    x_position: 1,
    y_position: 1,
    stattype: {},
    channel_group: 1,
    user: 1,
    color_palette: "string",
  };

  let squacApiService;
  let widgetService: WidgetService;

  beforeEach(() => {
    return MockBuilder(WidgetService, WidgetModule)
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
  beforeEach(() => {
    widgetService = TestBed.inject(WidgetService);
  });

  it("should be created", () => {
    const service: WidgetService = TestBed.inject(WidgetService);
    expect(service).toBeTruthy();
  });
});
