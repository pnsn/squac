import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { WidgetMainComponent } from "./widget-main.component";
import { ActivatedRoute } from "@angular/router";
import { of, Subject } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { MeasurementService } from "@squacapi/services/measurement.service";
import { WidgetModule } from "app/features/widget/widget.module";
import { AbilityModule } from "@casl/angular";
import { Ability, PureAbility } from "@casl/ability";
import { AppAbility } from "@core/utils/ability";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ViewService } from "@core/services/view.service";
import { MockComponent, MockProvider } from "ng-mocks";
import { WidgetDetailComponent } from "../widget-detail/widget-detail.component";

describe("WidgetMainComponent", () => {
  let component: WidgetMainComponent;
  let fixture: ComponentFixture<WidgetMainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        WidgetModule,
        AbilityModule,
      ],
      declarations: [WidgetMainComponent, MockComponent(WidgetDetailComponent)],
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
