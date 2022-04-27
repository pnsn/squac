import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { MetricViewComponent } from "./metric-view.component";
import { MetricService } from "@metric/services/metric.service";
import { RouterTestingModule } from "@angular/router/testing";
import { MockMetricService } from "@metric/services/metric.service.mock";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { AbilityModule } from "@casl/angular";
import { Ability, PureAbility } from "@casl/ability";
import { AppAbility } from "@core/utils/ability";

describe("MetricViewComponent", () => {
  let component: MetricViewComponent;
  let fixture: ComponentFixture<MetricViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxDatatableModule, AbilityModule],
      declarations: [MetricViewComponent],
      providers: [
        { provide: MetricService, useClass: MockMetricService },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility, useExisting: Ability },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
