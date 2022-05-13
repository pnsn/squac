import { TestBed } from "@angular/core/testing";
import { Channel } from "@core/models/channel";
import { ChannelGroup } from "@core/models/channel-group";
import { Metric } from "@core/models/metric";
import { ViewService } from "@core/services/view.service";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";
import { Widget } from "../models/widget";
import { WidgetModule } from "../widget.module";
import { MeasurementService } from "./measurement.service";

import { WidgetDataService } from "./widget-data.service";

describe("WidgetDataService", () => {
  let service: WidgetDataService;
  const testMetric = new Metric(1, 1, "", "", "", "", "", 1);
  const testChannel = new Channel(1, "", "", 1, 1, 1, 1, "", "", "", "", "");
  const testWidget = new Widget(1, 1, "", "", 1, 1, 1, 1, 1, 1, 1, [
    testMetric,
  ]);
  testWidget.channelGroup = new ChannelGroup(1, 1, "", "", 1, [1, 2]);
  testWidget.channelGroup.channels = [testChannel];
  testWidget.stattype = { type: "tabular" };
  let viewService;

  beforeEach(() => {
    return MockBuilder(WidgetDataService, WidgetModule)
      .provide({
        provide: MeasurementService,
        useValue: {
          getData: () => {
            return of();
          },
        },
      })
      .mock(ViewService);
  });

  beforeEach(() => {
    service = TestBed.inject(WidgetDataService);
    viewService = TestBed.inject(ViewService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should set widget", () => {
    const widgetSpy = spyOn(service, "setWidget");

    service.setWidget(testWidget);

    expect(widgetSpy).toHaveBeenCalled();
  });

  it("should not try to fetch measurements if no widget", () => {
    const viewSpy = spyOn(viewService, "widgetStartedLoading");
    service.fetchMeasurements("start", "end");
    expect(viewSpy).not.toHaveBeenCalled();
  });

  it("should try to get measurements if there is a widget and dates", () => {
    service.setWidget(testWidget);

    const viewSpy = spyOn(viewService, "widgetStartedLoading");
    service.fetchMeasurements("start", "end");
    expect(viewSpy).toHaveBeenCalled();
  });
});
