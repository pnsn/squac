import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { MetricsDetailComponent } from "./metrics-detail.component";
import { RouterTestingModule } from "@angular/router/testing";
import { MetricsService } from "@features/metrics/services/metrics.service";
import { of, Observable } from "rxjs";
import { Metric } from "@core/models/metric";
import { MockMetricsService } from "@features/metrics/services/metrics.service.mock";
import { AbilityModule } from "@casl/angular";
import { Ability, PureAbility } from "@casl/ability";
import { AppAbility } from "@core/utils/ability";

describe("MetricsDetailComponent", () => {
  let component: MetricsDetailComponent;
  let fixture: ComponentFixture<MetricsDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AbilityModule],
      declarations: [MetricsDetailComponent],
      providers: [
        { provide: MetricsService, useClass: MockMetricsService },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility, useExisting: Ability },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
