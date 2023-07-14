import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WidgetConnectService } from "../../services/widget-connect.service";
import { WidgetManagerService } from "../../services/widget-manager.service";
import { WidgetConfigService } from "../../services/widget-config.service";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";
import { ParallelPlotComponent } from "./parallel-plot.component";

describe("ParallelPlotComponent", () => {
  let component: ParallelPlotComponent;
  let fixture: ComponentFixture<ParallelPlotComponent>;

  beforeEach(() => {
    return MockBuilder(ParallelPlotComponent)
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
    fixture = TestBed.createComponent(ParallelPlotComponent);
    component = fixture.componentInstance;

    component.selectedMetrics = [];
    component.channels = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
