import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { MetricsComponent } from "./metrics.component";
import { MetricsService } from "@features/metrics/services/metrics.service";
import { MockMetricsService } from "@features/metrics/services/metrics.service.mock";
import { RouterTestingModule } from "@angular/router/testing";

describe("MetricsComponent", () => {
  let component: MetricsComponent;
  let fixture: ComponentFixture<MetricsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MetricsComponent],
      providers: [{ provide: MetricsService, useClass: MockMetricsService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
