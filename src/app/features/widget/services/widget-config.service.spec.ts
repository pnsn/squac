import { WidgetConfigService } from "./widget-config.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ViewService } from "@core/services/view.service";
import { WidgetService } from "./widget.service";
import { MockBuilder, MockRender, MockReset } from "ng-mocks";
import { EMPTY } from "rxjs";
import { ConfigurationService } from "@core/services/configuration.service";

describe("WidgetConfigService", () => {
  beforeEach(() => {
    return MockBuilder(WidgetConfigService, HttpClientTestingModule).provide({
      provide: ConfigurationService,
      useValue: {
        getValue: (value: string) => {
          return [];
        },
      },
    });
  });

  afterAll(MockReset);

  it("should be created", () => {
    const service = MockRender(WidgetConfigService).point.componentInstance;
    expect(service).toBeTruthy();
  });
});
