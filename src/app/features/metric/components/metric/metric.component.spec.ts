import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { MetricComponent } from "./metric.component";
import { RouterTestingModule } from "@angular/router/testing";

describe("MetricComponent", () => {
  let component: MetricComponent;
  let fixture: ComponentFixture<MetricComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MetricComponent],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
