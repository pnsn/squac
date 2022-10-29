import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WidgetConnectService } from "@features/widget/services/widget-connect.service";
import { WidgetManagerService } from "@features/widget/services/widget-manager.service";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { MockBuilder } from "ng-mocks";
import { NgxEchartsModule } from "ngx-echarts";
import { of } from "rxjs";

import { ParallelPlotComponent } from "./parallel-plot.component";

describe("ParallelPlotComponent", () => {
  let component: ParallelPlotComponent;
  let fixture: ComponentFixture<ParallelPlotComponent>;

  beforeEach(() => {
    return MockBuilder(ParallelPlotComponent)
      .mock(NgxEchartsModule)
      .mock(WidgetTypeService)
      .provide({
        provide: WidgetManagerService,
        useValue: {
          toggleKey: of(),
          widgetType: {},
        },
      })
      .provide({
        provide: WidgetConnectService,
        useValue: {
          deemphasizeChannel: of(),
          emphasizedChannel: of(),
        },
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParallelPlotComponent);
    component = fixture.componentInstance;
    component.data = {};
    component.selectedMetrics = [];
    component.channels = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
