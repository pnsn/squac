import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardDetailComponent } from "./dashboard-detail.component";
import { RouterTestingModule } from "@angular/router/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { Ability } from "@casl/ability";
import { ViewService } from "../projects/squac-ui/src/app/features/dashboard/services/view.service";
import { Dashboard } from "@squacapi/models/dashboard";
import { UserPipe } from "@squacapi/pipes/user.pipe";
import { OrganizationPipe } from "@squacapi/pipes/organization.pipe";
import { SharedIndicatorComponent } from "../projects/squac-ui/src/app/shared/components/shared-indicator/shared-indicator.component";
import { ErrorComponent } from "../projects/squac-ui/src/app/shared/components/error/error.component";
import { MaterialModule } from "../projects/squac-ui/src/app/shared/material.module";
import { ConfirmDialogService } from "../projects/squac-ui/src/app/core/services/confirm-dialog.service";
import { MockBuilder } from "ng-mocks";
import { DateSelectComponent } from "../projects/squac-ui/src/app/shared/components/date-select/date-select.component";
import { DataTypeSelectorComponent } from "./data-type-selector/data-type-selector.component";
import { SharedModule } from "../projects/squac-ui/src/app/shared/shared.module";
import { ChannelFilterComponent } from "./channel-filter/channel-filter.component";
import { ChannelGroupSelectorComponent } from "../projects/squac-ui/src/app/shared/components/channel-group-selector/channel-group-selector.component";

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
            dashboard: new Dashboard(
              1,
              1,
              "name",
              "description",
              false,
              false,
              1
            ),
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
