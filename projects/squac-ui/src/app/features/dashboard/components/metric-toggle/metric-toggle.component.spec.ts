import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MetricToggleComponent } from "./metric-toggle.component";

describe("MetricToggleComponent", () => {
  let component: MetricToggleComponent;
  let fixture: ComponentFixture<MetricToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
