import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WidgetEditOptionsComponent } from "./widget-edit-options.component";
import { MockBuilder } from "ng-mocks";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";

describe("WidgetEditOptionsComponent", () => {
  let component: WidgetEditOptionsComponent;
  let fixture: ComponentFixture<WidgetEditOptionsComponent>;

  beforeEach(() => {
    return MockBuilder([
      WidgetEditOptionsComponent,
      ReactiveFormsModule,
      FormBuilder,
    ]);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetEditOptionsComponent);
    component = fixture.componentInstance;
    component.properties = {};
    component.gradientOptions = [];
    component.solidOptions = [];
    component.thresholds = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
