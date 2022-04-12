import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { WidgetsComponent } from "./widgets.component";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { MeasurementsService } from "../../services/measurements.service";
import { WidgetsModule } from "../../widgets.module";
import { AbilityModule } from "@casl/angular";
import { Ability, PureAbility } from "@casl/ability";
import { AppAbility } from "@core/utils/ability";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ViewService } from "@core/services/view.service";
import { MockViewService } from "@core/services/view.service.mock";
import { MockProvider } from "ng-mocks";

describe("WidgetsComponent", () => {
  let component: WidgetsComponent;
  let fixture: ComponentFixture<WidgetsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        WidgetsModule,
        AbilityModule,
      ],
      providers: [
        { provide: ViewService, useClass: MockViewService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 123 }),
            data: of({ widgets: [] }),
          },
        },
        MockProvider(MeasurementsService),
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility, useExisting: Ability },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
