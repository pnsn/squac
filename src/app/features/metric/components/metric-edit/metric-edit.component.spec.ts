import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { MetricEditComponent } from "./metric-edit.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MetricService } from "@features/metric/services/metric.service";
import { MockMetricService } from "@features/metric/services/metric.service.mock";
import { AbilityModule } from "@casl/angular";
import { Ability, PureAbility } from "@casl/ability";
import { AppAbility } from "@core/utils/ability";
import { MatDialogModule } from "@angular/material/dialog";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";

describe("MetricEditComponent", () => {
  let component: MetricEditComponent;
  let fixture: ComponentFixture<MetricEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        AbilityModule,
        MatDialogModule,
      ],
      declarations: [MetricEditComponent],
      providers: [
        ConfirmDialogService,
        { provide: MetricService, useClass: MockMetricService },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility, useExisting: Ability },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
