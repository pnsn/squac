import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WidgetEditOptionsComponent } from "./widget-edit-options.component";
import { MockBuilder } from "ng-mocks";
import { WidgetModule } from "@features/widget/widget.module";
import { ReactiveFormsModule } from "@angular/forms";

describe("WidgetEditOptionsComponent", () => {
  let component: WidgetEditOptionsComponent;
  let fixture: ComponentFixture<WidgetEditOptionsComponent>;

  beforeEach(() => {
    return MockBuilder(WidgetEditOptionsComponent, WidgetModule).keep(
      ReactiveFormsModule
    );
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
