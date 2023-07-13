import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { WidgetMainComponent } from "./widget-main.component";
import { ActivatedRoute } from "@angular/router";
import { of, Subject } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { MeasurementService } from "squacapi";
import { AbilityModule } from "@casl/angular";
import { Ability, PureAbility } from "@casl/ability";
import { AppAbility } from "@core/utils/ability";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ViewService } from "@dashboard/services/view.service";
import { MockComponent, MockModule, MockProvider } from "ng-mocks";
import { MatSidenavModule } from "@angular/material/sidenav";
import { ChannelFilterComponent } from "../../components/channel-filter/channel-filter.component";
import { LoadingComponent } from "@shared/components/loading/loading.component";
import { WidgetDetailComponent } from "@dashboard/components/detail/widget-detail.component";

describe("WidgetMainComponent", () => {
  let component: WidgetMainComponent;
  let fixture: ComponentFixture<WidgetMainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        AbilityModule,
        MockModule(MatSidenavModule),
      ],
      declarations: [
        MockComponent(LoadingComponent),
        WidgetMainComponent,
        MockComponent(WidgetDetailComponent),
        MockComponent(ChannelFilterComponent),
      ],
      providers: [
        MockProvider(ViewService, {
          widgetUpdated: new Subject(),
          resize: new Subject(),
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 123 }),
            data: of({ widgets: [] }),
          },
        },
        MockProvider(MeasurementService),
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility, useExisting: Ability },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetMainComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
