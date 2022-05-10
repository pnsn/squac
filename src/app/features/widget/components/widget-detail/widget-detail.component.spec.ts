import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WidgetDetailComponent } from "./widget-detail.component";
import { WidgetModule } from "../../widget.module";
import { RouterTestingModule } from "@angular/router/testing";
import { Widget } from "@widget/models/widget";
import { Ability } from "@casl/ability";
import { AbilityModule } from "@casl/angular";
import { ViewService } from "@core/services/view.service";
import { MockBuilder } from "ng-mocks";
import { ErrorComponent } from "@shared/components/error/error.component";
import { BehaviorSubject, of, Subject } from "rxjs";
import { WidgetDataService } from "@features/widget/services/widget-data.service";
import { DashboardService } from "@features/dashboard/services/dashboard.service";

describe("WidgetDetailComponent", () => {
  let component: WidgetDetailComponent;
  let fixture: ComponentFixture<WidgetDetailComponent>;

  beforeEach(() => {
    return MockBuilder(WidgetDetailComponent, WidgetModule)
      .mock(AbilityModule)
      .mock(Ability)
      .mock(ErrorComponent)
      .keep(RouterTestingModule.withRoutes([]))
      .provide({
        provide: DashboardService,
        useValue: {
          getDashboards: () => {
            return of();
          },
        },
      })
      .provide({
        provide: WidgetDataService,
        useValue: {
          data: new Subject(),
        },
      })
      .provide({
        provide: ViewService,
        useValue: {
          status: new BehaviorSubject("loading"),
          error: new Subject(),
          updateData: new Subject(),
        },
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetDetailComponent);
    component = fixture.componentInstance;
    component.widget = new Widget(
      1,
      1,
      "name",
      "description",
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      []
    );
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
