import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DateService } from "@core/services/date.service";
import { ViewService } from "@dashboard/services/view.service";
import { WidgetConnectService } from "../../services/widget-connect.service";
import { WidgetManagerService } from "../../services/widget-manager.service";
import { WidgetConfigService } from "../../services/widget-config.service";
import { MockBuilder } from "ng-mocks";
import { NgxEchartsModule } from "ngx-echarts";
import { of } from "rxjs";

import { TimechartComponent } from "./timechart.component";

describe("TimechartComponent", () => {
  let component: TimechartComponent;
  let fixture: ComponentFixture<TimechartComponent>;

  beforeEach(() => {
    return MockBuilder(TimechartComponent)
      .mock(NgxEchartsModule)
      .mock(ViewService)
      .mock(DateService)
      .mock(WidgetConfigService)
      .provide({
        provide: WidgetManagerService,
        useValue: {
          toggleKey: of(),
          widgetType: {},
          widgetConfig: {},
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
    fixture = TestBed.createComponent(TimechartComponent);
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
