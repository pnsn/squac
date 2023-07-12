import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { WidgetEditMetricsComponent } from "./widget-edit-metrics.component";
import { LoadingComponent } from "@shared/components/loading/loading.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MetricService } from "squacapi";
import { MaterialModule } from "@shared/material.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe("WidgetEditMetricsComponent", () => {
  let component: WidgetEditMetricsComponent;
  let fixture: ComponentFixture<WidgetEditMetricsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MaterialModule,
        LoadingComponent,
        NoopAnimationsModule,
      ],
      providers: [MetricService],
      declarations: [WidgetEditMetricsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetEditMetricsComponent);
    component = fixture.componentInstance;
    component.metrics = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
