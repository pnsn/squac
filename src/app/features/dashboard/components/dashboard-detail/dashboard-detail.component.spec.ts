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

describe("DashboardDetailComponent", () => {
  let component: DashboardDetailComponent;
  let fixture: ComponentFixture<DashboardDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        FormsModule,
        NgxDatatableModule,
        MaterialModule,
        WidgetModule,
        AbilityModule,
        NgxDaterangepickerMd.forRoot(),
        BrowserAnimationsModule,
      ],
      providers: [
        DashboardService,
        {
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
        },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility, useExisting: Ability },
        { provide: ViewService, useValue: new MockViewService() },
      ],
      declarations: [
        DashboardDetailComponent,
        UserPipe,
        OrganizationPipe,
        SharedIndicatorComponent,
        ErrorComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
