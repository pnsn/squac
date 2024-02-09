import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardDetailComponent } from "./dashboard-detail.component";
import { RouterTestingModule } from "@angular/router/testing";
import { ActivatedRoute } from "@angular/router";
import { of, Subject } from "rxjs";
import { Ability } from "@casl/ability";
import { ViewService } from "@dashboard/services/view.service";
import { Dashboard } from "squacapi";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { MockBuilder } from "ng-mocks";

describe("DashboardDetailComponent", () => {
  let component: DashboardDetailComponent;
  let fixture: ComponentFixture<DashboardDetailComponent>;

  beforeEach(() =>
    MockBuilder(DashboardDetailComponent)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(ConfirmDialogService)
      .provide({
        provide: ViewService,
        useValue: {
          dashboard: new Dashboard(),
          status: of(),
          error: of(),
          hasUnsavedChanges: new Subject(),
          setDashboard: () => {
            return;
          },
        },
      })
      .provide({
        provide: Ability,
        useValue: {
          can: (_type, _resource) => {
            return _resource ? true : undefined;
          },
        },
      })
      .provide({
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: 123 }),
          data: of({
            dashboard: new Dashboard({
              id: 1,
              user: 1,
              name: "name",
              description: "description",
              organization: 1,
            }),
          }),
        },
      })
  );
  it("should create", () => {
    fixture = TestBed.createComponent(DashboardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
