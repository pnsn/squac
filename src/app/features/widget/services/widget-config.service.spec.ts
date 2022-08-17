import { WidgetConfigService } from "./widget-config.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MockBuilder, MockRender, MockReset } from "ng-mocks";
import { ConfigurationService } from "@core/services/configuration.service";

describe("WidgetConfigService", () => {
  beforeEach(() => {
    return MockBuilder(WidgetConfigService, HttpClientTestingModule).provide({
      provide: ConfigurationService,
      useValue: {
        getValue: (_value: string) => {
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
