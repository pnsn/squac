import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardDetailComponent } from "./dashboard-detail.component";
import { RouterTestingModule } from "@angular/router/testing";
import { ActivatedRoute } from "@angular/router";
import { of, Subject } from "rxjs";
import { Ability } from "@casl/ability";
import { ViewService } from "@dashboard/services/view.service";
import { Dashboard } from "squacapi";
import { UserPipe } from "squacapi";
import { OrganizationPipe } from "squacapi";
import { SharedIndicatorComponent } from "@shared/components/shared-indicator/shared-indicator.component";
import { ErrorComponent } from "@shared/components/error/error.component";
import { MaterialModule } from "@shared/material.module";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { MockBuilder } from "ng-mocks";
import { DateSelectComponent } from "@shared/components/date-select/date-select.component";
import { DataTypeSelectorComponent } from "./data-type-selector/data-type-selector.component";
import { SharedModule } from "@shared/shared.module";
import { ChannelFilterComponent } from "./channel-filter/channel-filter.component";
import { ChannelGroupSelectorComponent } from "@shared/components/channel-group-selector/channel-group-selector.component";

describe("DashboardDetailComponent", () => {
  let component: DashboardDetailComponent;
  let fixture: ComponentFixture<DashboardDetailComponent>;

  beforeEach(() =>
    MockBuilder(DashboardDetailComponent)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(ConfirmDialogService)
      .mock(MaterialModule)
      .mock(SharedModule)
      .mock(ChannelFilterComponent)
      .provide({
        provide: ViewService,
        useValue: {
          status: of(),
          error: of(),
          hasUnsavedChanges: new Subject(),
          setDashboard: () => {
            return;
          },
        },
      })
      .mock(Ability)
      .mock(DataTypeSelectorComponent)
      .mock([
        DateSelectComponent,
        DataTypeSelectorComponent,
        UserPipe,
        OrganizationPipe,
        SharedIndicatorComponent,
        ErrorComponent,
        ChannelFilterComponent,
        ChannelGroupSelectorComponent,
      ])
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
