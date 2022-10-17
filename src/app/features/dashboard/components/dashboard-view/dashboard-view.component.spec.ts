import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardViewComponent } from "./dashboard-view.component";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBuilder } from "ng-mocks";
import { DashboardService } from "@features/dashboard/services/dashboard.service";
import { DashboardModule } from "@features/dashboard/dashboard.module";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

describe("DashboardViewComponent", () => {
  let component: DashboardViewComponent;
  let fixture: ComponentFixture<DashboardViewComponent>;

  beforeEach(() => {
    return MockBuilder(DashboardViewComponent)
      .mock(DashboardModule)
      .keep(RouterTestingModule.withRoutes([]))
      .provide({
        provide: ActivatedRoute,
        useValue: {
          params: of(),
        },
      })
      .mock(DashboardService);
  });

  it("should create", () => {
    fixture = TestBed.createComponent(DashboardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
