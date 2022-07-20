import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DateService } from "@core/services/date.service";
import { ViewService } from "@core/services/view.service";
import { WidgetConnectService } from "@features/widget/services/widget-connect.service";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { WidgetModule } from "@features/widget/widget.module";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";
import { TimechartComponent } from "../timechart/timechart.component";

import { CalendarComponent } from "./calendar.component";

describe("CalendarComponent", () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  beforeEach(() => {
    return MockBuilder(TimechartComponent, WidgetModule)
      .mock(ViewService)
      .mock(DateService)
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
    fixture = TestBed.createComponent(CalendarComponent);
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
