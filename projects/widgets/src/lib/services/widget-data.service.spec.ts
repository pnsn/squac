import { TestBed } from "@angular/core/testing";
import { ViewService } from "@dashboard/services/view.service";
import { MockBuilder } from "ng-mocks";
import { of, Subject } from "rxjs";
import { MeasurementService } from "squacapi";

import { WidgetDataService } from "./widget-data.service";

describe("WidgetDataService", () => {
  let service: WidgetDataService;

  beforeEach(() => {
    return MockBuilder(WidgetDataService)
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
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});