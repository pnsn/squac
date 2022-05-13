import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DateService } from "@core/services/date.service";
import { ViewService } from "@core/services/view.service";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { WidgetModule } from "@features/widget/widget.module";
import { MockBuilder } from "ng-mocks";

import { TimechartComponent } from "./timechart.component";

fdescribe("TimechartComponent", () => {
  let component: TimechartComponent;
  let fixture: ComponentFixture<TimechartComponent>;

  beforeEach(() => {
    return MockBuilder(TimechartComponent, WidgetModule)
      .mock(ViewService)
      .mock(DateService)
      .mock(WidgetTypeService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimechartComponent);
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
