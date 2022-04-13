import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { WidgetDetailComponent } from "./widget-detail.component";
import { WidgetsModule } from "../../widgets.module";
import { RouterTestingModule } from "@angular/router/testing";
import { Widget } from "@features/widgets/models/widget";
import { MeasurementsService } from "@features/widgets/services/measurements.service";
import { AppAbility } from "@core/utils/ability";
import { PureAbility, Ability } from "@casl/ability";
import { AbilityModule } from "@casl/angular";
import { ViewService } from "@core/services/view.service";
import { MockViewService } from "@core/services/view.service.mock";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MockProvider } from "ng-mocks";

describe("WidgetDetailComponent", () => {
  let component: WidgetDetailComponent;
  let fixture: ComponentFixture<WidgetDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        WidgetsModule,
        RouterTestingModule.withRoutes([]),
        AbilityModule,
        HttpClientTestingModule,
      ],
      providers: [
        MockProvider(MeasurementsService),
        { provide: ViewService, useValue: new MockViewService() },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility, useExisting: Ability },
      ],
    }).compileComponents();
  }));

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
