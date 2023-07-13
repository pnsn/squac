import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WidgetConnectService } from "../../services/widget-connect.service";
import { WidgetManagerService } from "../../services/widget-manager.service";
import { WidgetConfigService } from "../../services/widget-config.service";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";
import { CalendarComponent } from "./calendar.component";

describe("CalendarComponent", () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  beforeEach(() => {
    return MockBuilder(CalendarComponent)
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
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    component.selectedMetrics = [];
    component.channels = [];
    component.properties = {};
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
