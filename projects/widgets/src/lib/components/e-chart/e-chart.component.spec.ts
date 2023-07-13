import { NgZone } from "@angular/core";
import { MockBuilder } from "ng-mocks";
import { ProcessedData } from "../../interfaces";
import { WidgetConnectService, WidgetManagerService } from "../../services";
import { EChartComponent } from "./e-chart.component";

/**
 *
 */
class TestComponent extends EChartComponent {
  constructor(
    override widgetManager: WidgetManagerService,
    override widgetConnector: WidgetConnectService,
    override ngZone: NgZone
  ) {
    super(widgetManager, widgetConnector, ngZone);
  }

  /**
   * stubbed
   *
   * @param _data input data
   */
  buildChartData(_data: ProcessedData): Promise<void> {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }

  /**
   *
   */
  changeMetrics(): void {
    return;
  }

  /**
   *
   */
  configureChart(): void {
    return;
  }
}

describe("EChartComponent", () => {
  let _chartComponent: TestComponent;

  beforeEach(() => {
    return MockBuilder(TestComponent);
  });
  // it("should create", () => {});
});
