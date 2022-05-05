import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardDetailComponent } from "./dashboard-detail.component";
import { RouterTestingModule } from "@angular/router/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { DashboardService } from "../../services/dashboard.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule } from "@angular/forms";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { AppAbility } from "@core/utils/ability";
import { Ability, PureAbility } from "@casl/ability";
import { AbilityModule } from "@casl/angular";
import { WidgetModule } from "@widget/widget.module";
import { ViewService } from "@core/services/view.service";
import { MockViewService } from "@core/services/view.service.mock";
import { Dashboard } from "@dashboard/models/dashboard";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { UserPipe } from "@shared/pipes/user.pipe";
import { OrganizationPipe } from "@shared/pipes/organization.pipe";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedIndicatorComponent } from "@shared/components/shared-indicator/shared-indicator.component";
import { ErrorComponent } from "@shared/components/error/error.component";
import { MaterialModule } from "@shared/material.module";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { MockBuilder } from "ng-mocks";
import { DateSelectComponent } from "@shared/components/date-select/date-select.component";
import { DataTypeSelectorComponent } from "./data-type-selector/data-type-selector.component";
import { SharedModule } from "@shared/shared.module";

describe("DashboardDetailComponent", () => {
  let component: DashboardDetailComponent;
  let fixture: ComponentFixture<DashboardDetailComponent>;

  beforeEach(() =>
    MockBuilder(DashboardDetailComponent)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(ConfirmDialogService)
      .mock(MaterialModule)
      .mock(SharedModule)
      .provide({
        provide: ViewService,
        useValue: {
          status: of(),
          error: of(),
          setDashboard: () => {},
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
              1,
              []
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
