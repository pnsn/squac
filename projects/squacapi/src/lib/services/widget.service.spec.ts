import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { WidgetService } from "./widget.service";

describe("WidgetService", () => {
  beforeEach(() => {
    return MockBuilder(WidgetService, ApiService);
  });

  it("should be created", () => {
    const service: WidgetService = TestBed.inject(WidgetService);
    expect(service).toBeTruthy();
  });
});
