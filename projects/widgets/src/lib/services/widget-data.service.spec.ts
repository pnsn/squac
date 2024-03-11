import { TestBed } from "@angular/core/testing";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";
import { MeasurementService } from "squacapi";

import { WidgetDataService } from "./widget-data.service";

describe("WidgetDataService", () => {
  let service: WidgetDataService;

  beforeEach(() => {
    return MockBuilder(WidgetDataService).provide({
      provide: MeasurementService,
      useValue: {
        getData: (_params?) => {
          return of([]);
        },
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
