import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";

import { MetricToggleComponent } from "./metric-toggle.component";

describe("MetricToggleComponent", () => {
  let component: MetricToggleComponent;
  let fixture: ComponentFixture<MetricToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MetricToggleComponent],
      imports: [MatMenuModule, MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
