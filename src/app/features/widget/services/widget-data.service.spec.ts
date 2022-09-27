import { TestBed } from "@angular/core/testing";
import { Metric } from "@core/models/metric";
import { ViewService } from "@core/services/view.service";
import { MockBuilder } from "ng-mocks";
import { of, Subject } from "rxjs";
import { Widget } from "../models/widget";
import { WidgetType } from "../models/widget-type";
import { WidgetModule } from "../widget.module";
import { MeasurementService } from "./measurement.service";

import { WidgetDataService } from "./widget-data.service";

describe("WidgetDataService", () => {
  let service: WidgetDataService;
  const testMetric = new Metric(1, 1, "", "", "", "", "", 1);
  const testWidget = new Widget(1, 1, "", 1, [testMetric], "", "");
  const testType = new WidgetType(
    1,
    "name",
    "type",
    "desc",
    "display",
    false,
    true,
    true,
    0,
    []
  );
  testWidget.type = "tabular";
  let viewService;

  beforeEach(() => {
    return MockBuilder(WidgetDataService, WidgetModule)
      .provide({
        provide: MeasurementService,
        useValue: {
          getData: (_params?) => {
            return of([]);
          },
        },
      })
      .provide({
        provide: ViewService,
        useValue: {
          channels: of(),
          updateData: of(),
          finishedLoading: () => {
            return;
          },
          channelGroupId: new Subject(),
          startTime: "start",
          endTime: "end",
          archiveType: "raw",
          channelsString: "test.test.test.test",
        },
      });
  });

  beforeEach(() => {
    service = TestBed.inject(WidgetDataService);
    viewService = TestBed.inject(ViewService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should set widget", () => {
    const widgetSpy = spyOn(service, "updateWidget");
    service.updateWidget(testWidget, testType);

    expect(widgetSpy).toHaveBeenCalled();
  });

  it("should not try to fetch measurements if no widget", () => {
    const updateSpy = spyOn(viewService, "updateData");
    service.updateWidget(null, testType);
    expect(updateSpy).not.toHaveBeenCalled();
  });
});
