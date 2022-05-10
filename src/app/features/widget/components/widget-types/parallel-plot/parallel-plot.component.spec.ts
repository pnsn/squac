import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ParallelPlotComponent } from "./parallel-plot.component";

describe("ParallelPlotComponent", () => {
  let component: ParallelPlotComponent;
  let fixture: ComponentFixture<ParallelPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParallelPlotComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParallelPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
