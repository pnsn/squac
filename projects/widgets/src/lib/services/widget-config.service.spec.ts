import { TestBed } from "@angular/core/testing";
import { MockBuilder } from "ng-mocks";

import { WidgetConfigService } from "./widget-config.service";

describe("WidgetConfigService", () => {
  let service: WidgetConfigService;

  beforeEach(() => {
    return MockBuilder(WidgetConfigService);
  });

  beforeEach(() => {
    service = TestBed.inject(WidgetConfigService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
