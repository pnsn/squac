import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WidgetDetailComponent } from "./widget-detail.component";
import { RouterTestingModule } from "@angular/router/testing";
import { Widget, WidgetConnectService, WidgetManagerService } from "widgets";
import { ViewService } from "@dashboard/services/view.service";
import { MockBuilder } from "ng-mocks";
import { BehaviorSubject, ReplaySubject, Subject } from "rxjs";
import { WidgetDataService } from "widgets";

describe("WidgetDetailComponent", () => {
  let component: WidgetDetailComponent;
  let fixture: ComponentFixture<WidgetDetailComponent>;

  beforeEach(() => {
    return MockBuilder(WidgetDetailComponent)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(WidgetDataService)
      .keep(WidgetManagerService)
      .provide({
        provide: WidgetConnectService,
        useValue: {
          useDenseView: new Subject(),
        },
      })
      .provide({
        provide: WidgetManagerService,
        useValue: {
          widget$: new ReplaySubject(),
          zoomStatus$: new Subject(),
          toggleKey$: new Subject(),
        },
      })
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
    component.widget = new Widget({ id: 1, user: 1, organization: 1 });
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
