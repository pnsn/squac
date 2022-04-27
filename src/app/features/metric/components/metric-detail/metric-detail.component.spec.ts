import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { MetricDetailComponent } from "./metric-detail.component";
import { RouterTestingModule } from "@angular/router/testing";
import { MetricService } from "@metric/services/metric.service";
import { MockMetricService } from "@metric/services/metric.service.mock";
import { AbilityModule } from "@casl/angular";
import { Ability, PureAbility } from "@casl/ability";
import { AppAbility } from "@core/utils/ability";

describe("MetricDetailComponent", () => {
  let component: MetricDetailComponent;
  let fixture: ComponentFixture<MetricDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AbilityModule],
      declarations: [MetricDetailComponent],
      providers: [
        { provide: MetricService, useClass: MockMetricService },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility, useExisting: Ability },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
