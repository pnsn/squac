import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WidgetDetailComponent } from "./widget-detail.component";
import { RouterTestingModule } from "@angular/router/testing";
import { Widget } from "@squacapi/models/widget";
import { ViewService } from "@dashboard/services/view.service";
import { MockBuilder } from "ng-mocks";
import { BehaviorSubject, Subject } from "rxjs";
import { WidgetDataService } from "app/widgets/services/widget-data.service";
import { DashboardService } from "@squacapi/services/dashboard.service";
import { MetricToggleComponent } from "./metric-toggle/metric-toggle.component";
import { MatMenuModule } from "@angular/material/menu";
import { AbilityModule } from "@casl/angular";
import { MatIconModule } from "@angular/material/icon";
import { LoadingDirective } from "@shared/directives/loading-directive.directive";

describe("WidgetDetailComponent", () => {
  let component: WidgetDetailComponent;
  let fixture: ComponentFixture<WidgetDetailComponent>;

  beforeEach(() => {
    return MockBuilder(WidgetDetailComponent)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(DashboardService)
      .mock(WidgetDataService)
      .mock(MetricToggleComponent)
      .mock(MatMenuModule)
      .mock(MatIconModule)
      .mock(LoadingDirective)
      .mock(AbilityModule)
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
