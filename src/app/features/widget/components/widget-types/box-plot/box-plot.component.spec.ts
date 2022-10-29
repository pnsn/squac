import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WidgetManagerService } from "@features/widget/services/widget-manager.service";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { MockBuilder } from "ng-mocks";
import { NgxEchartsModule } from "ngx-echarts";

import { BoxPlotComponent } from "./box-plot.component";

describe("BoxPlotComponent", () => {
  let component: BoxPlotComponent;
  let fixture: ComponentFixture<BoxPlotComponent>;

  beforeEach(() => {
    return MockBuilder(BoxPlotComponent)
      .mock(NgxEchartsModule)
      .mock(WidgetTypeService)
      .mock(WidgetManagerService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
