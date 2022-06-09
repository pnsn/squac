import { WidgetConfigService } from "./widget-config.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ViewService } from "@core/services/view.service";
import { WidgetService } from "./widget.service";
import { MockBuilder, MockRender, MockReset } from "ng-mocks";
import { EMPTY } from "rxjs";

describe("WidgetConfigService", () => {
  beforeEach(() => {
    return MockBuilder(WidgetConfigService, HttpClientTestingModule)
      .mock(ViewService)
      .mock(WidgetService, {
        updateWidget: () => EMPTY,
      });
  });

  afterAll(MockReset);

  it("should be created", () => {
    const service = MockRender(WidgetConfigService).point.componentInstance;
    expect(service).toBeTruthy();
  });
});
