import { TestBed } from "@angular/core/testing";
import { MockBuilder } from "ng-mocks";

import { WidgetTypeService } from "./widget-type.service";

describe("WidgetTypeService", () => {
  let service: WidgetTypeService;

  beforeEach(() => {
    return MockBuilder(WidgetTypeService);
  });

  beforeEach(() => {
    service = TestBed.inject(WidgetTypeService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
