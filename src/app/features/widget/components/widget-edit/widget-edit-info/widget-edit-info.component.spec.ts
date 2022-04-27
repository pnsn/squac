import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { WidgetEditService } from "@features/widget/services/widget-edit.service";
import { MaterialModule } from "@shared/material.module";
import { MockBuilder } from "ng-mocks";

import { WidgetEditInfoComponent } from "./widget-edit-info.component";

describe("WidgetEditInfoComponent", () => {
  let component: WidgetEditInfoComponent;
  let fixture: ComponentFixture<WidgetEditInfoComponent>;

  beforeEach(() => {
    return MockBuilder(WidgetEditInfoComponent)
      .mock(MaterialModule)
      .mock(ReactiveFormsModule)
      .mock(WidgetEditService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetEditInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
