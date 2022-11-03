import { TestBed } from "@angular/core/testing";
import { MockBuilder } from "ng-mocks";
import { WidgetDataService } from "./widget-data.service";

import { WidgetManagerService } from "./widget-manager.service";

describe("WidgetManagerService", () => {
  let service: WidgetManagerService;

  beforeEach(() => {
    return MockBuilder(WidgetManagerService).mock(WidgetDataService);
  });

  beforeEach(() => {
    service = TestBed.inject(WidgetManagerService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
