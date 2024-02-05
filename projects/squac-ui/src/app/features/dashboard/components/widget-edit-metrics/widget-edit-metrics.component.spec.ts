import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WidgetEditMetricsComponent } from "./widget-edit-metrics.component";
import { MockBuilder } from "ng-mocks";

describe("WidgetEditMetricsComponent", () => {
  let component: WidgetEditMetricsComponent;
  let fixture: ComponentFixture<WidgetEditMetricsComponent>;

  beforeEach(() => {
    return MockBuilder(WidgetEditMetricsComponent);
  });

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
