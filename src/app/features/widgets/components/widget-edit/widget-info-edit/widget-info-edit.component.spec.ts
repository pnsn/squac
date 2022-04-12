import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { WidgetEditService } from "@features/widgets/services/widget-edit.service";
import { MaterialModule } from "@shared/material.module";
import { MockBuilder } from "ng-mocks";

import { WidgetInfoEditComponent } from "./widget-info-edit.component";

describe("WidgetInfoEditComponent", () => {
  let component: WidgetInfoEditComponent;
  let fixture: ComponentFixture<WidgetInfoEditComponent>;

  beforeEach(() => {
    return MockBuilder(WidgetInfoEditComponent)
      .mock(MaterialModule)
      .mock(ReactiveFormsModule)
      .mock(WidgetEditService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetInfoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
