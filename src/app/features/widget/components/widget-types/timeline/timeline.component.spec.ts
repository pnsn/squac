import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DateService } from "@core/services/date.service";
import { ViewService } from "@core/services/view.service";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { WidgetModule } from "@features/widget/widget.module";
import { MockBuilder, MockComponent } from "ng-mocks";
import { NgxEchartsModule } from "ngx-echarts";

import { TimelineComponent } from "./timeline.component";

describe("TimelineComponent", () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  beforeEach(() => {
    return MockBuilder(TimelineComponent, WidgetModule)
      .mock(NgxEchartsModule)
      .mock(ViewService)
      .mock(DateService)
      .mock(WidgetTypeService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineComponent);
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
