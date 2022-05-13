import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { TabularComponent } from "./tabular.component";
import { MeasurementPipe } from "@widget/pipes/measurement.pipe";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Widget } from "@widget/models/widget";
import { MockViewService } from "@core/services/view.service.mock";
import { ViewService } from "@core/services/view.service";
import { NgxEchartsModule } from "ngx-echarts";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { WidgetModule } from "@features/widget/widget.module";
import { MockBuilder } from "ng-mocks";

fdescribe("TabularComponent", () => {
  let component: TabularComponent;
  let fixture: ComponentFixture<TabularComponent>;

  beforeEach(() => {
    return MockBuilder(TabularComponent, WidgetModule)
      .mock(NgxEchartsModule)
      .mock(ViewService)
      .mock(WidgetTypeService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabularComponent);
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
