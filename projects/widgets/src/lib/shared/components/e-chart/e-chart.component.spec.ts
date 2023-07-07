import { NgZone, ɵNoopNgZone } from "@angular/core";
import { MockBuilder } from "ng-mocks";
import { ProcessedData } from "../../../interfaces";
import { WidgetConnectService, WidgetManagerService } from "../../../services";
import { EChartComponent } from "./e-chart.component";

class TestComponent extends EChartComponent {
  constructor(
    override widgetManager: WidgetManagerService,
    override widgetConnector: WidgetConnectService,
    override ngZone: NgZone
  ) {
    super(widgetManager, widgetConnector, ngZone);
  }

  buildChartData(data: ProcessedData): Promise<void> {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }

  changeMetrics(): void {}

  configureChart(): void {}
}

describe("EChartComponent", () => {
  let chartComponent: TestComponent;

  beforeEach(() => {
    return MockBuilder(TestComponent);
  });
  it("should create", () => {});
});
