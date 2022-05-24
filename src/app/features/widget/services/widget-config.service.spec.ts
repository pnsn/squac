import { WidgetConfigService } from "./widget-config.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ViewService } from "@core/services/view.service";
import { WidgetService } from "./widget.service";
import { Widget } from "@features/widget/models/widget";
import { Metric } from "@core/models/metric";
import { MockBuilder, MockRender, MockReset } from "ng-mocks";
import { EMPTY } from "rxjs";

describe("WidgetConfigService", () => {
  const testMetric = new Metric(1, 1, "name", "code", "desc", "", "", 1);

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
