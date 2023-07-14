import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WidgetConnectService } from "../../services/widget-connect.service";
import { WidgetManagerService } from "../../services/widget-manager.service";
import { WidgetConfigService } from "../../services/widget-config.service";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";

import { ScatterPlotComponent } from "./scatter-plot.component";

describe("ScatterPlotComponent", () => {
  let component: ScatterPlotComponent;
  let fixture: ComponentFixture<ScatterPlotComponent>;

  beforeEach(() => {
    return MockBuilder(ScatterPlotComponent)
      .mock(WidgetConfigService)
      .provide({
        provide: WidgetManagerService,
        useValue: {
          toggleKey: of(),
          widgetType: {},
          widgetConfig: {},
        },
      })
      .keep(WidgetConnectService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterPlotComponent);
    component = fixture.componentInstance;

    component.selectedMetrics = [];
    component.channels = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
