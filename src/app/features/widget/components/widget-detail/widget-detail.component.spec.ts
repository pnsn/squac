import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WidgetDetailComponent } from "./widget-detail.component";
import { WidgetModule } from "../../widget.module";
import { RouterTestingModule } from "@angular/router/testing";
import { Widget } from "@squacapi/models/widget";
import { ViewService } from "@core/services/view.service";
import { MockBuilder } from "ng-mocks";
import { BehaviorSubject, Subject } from "rxjs";
import { WidgetDataService } from "@features/widget/services/widget-data.service";
import { DashboardService } from "@features/dashboard/services/dashboard.service";

describe("WidgetDetailComponent", () => {
  let component: WidgetDetailComponent;
  let fixture: ComponentFixture<WidgetDetailComponent>;

  beforeEach(() => {
    return MockBuilder(WidgetDetailComponent)
      .mock(WidgetModule)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(DashboardService)
      .mock(WidgetDataService)
      .provide({
        provide: ViewService,
        useValue: {
          status: new BehaviorSubject("loading"),
          error: new Subject(),
          updateData: new Subject(),
          channelGroupId: new Subject(),
          channels: new Subject(),
          resize: new Subject(),
          widgetFinishedLoading: () => {
            return;
          },
        },
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetDetailComponent);
    component = fixture.componentInstance;
    component.widget = new Widget(1, 1, "name", 1, [], "", "");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
