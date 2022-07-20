import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WidgetConnectService } from "@features/widget/services/widget-connect.service";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { WidgetModule } from "@features/widget/widget.module";
import { MockBuilder } from "ng-mocks";
import { NgxEchartsModule } from "ngx-echarts";
import { of } from "rxjs";

import { ParallelPlotComponent } from "./parallel-plot.component";

describe("ParallelPlotComponent", () => {
  let component: ParallelPlotComponent;
  let fixture: ComponentFixture<ParallelPlotComponent>;

  beforeEach(() => {
    return MockBuilder(ParallelPlotComponent, WidgetModule)
      .mock(NgxEchartsModule)
      .mock(WidgetTypeService)
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
    component.metrics = [];
    component.selectedMetrics = [];
    component.channels = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
