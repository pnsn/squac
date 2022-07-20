import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TabularComponent } from "./tabular.component";
import { ViewService } from "@core/services/view.service";
import { NgxEchartsModule } from "ngx-echarts";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { WidgetModule } from "@features/widget/widget.module";
import { MockBuilder } from "ng-mocks";
import { WidgetConnectService } from "@features/widget/services/widget-connect.service";
import { of } from "rxjs";

describe("TabularComponent", () => {
  let component: TabularComponent;
  let fixture: ComponentFixture<TabularComponent>;

  beforeEach(() => {
    return MockBuilder(TabularComponent, WidgetModule)
      .mock(NgxEchartsModule)
      .mock(ViewService)
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
