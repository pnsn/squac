import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MockBuilder } from "ng-mocks";

import { WidgetEditInfoComponent } from "./widget-edit-info.component";

describe("WidgetEditInfoComponent", () => {
  let component: WidgetEditInfoComponent;
  let fixture: ComponentFixture<WidgetEditInfoComponent>;

  beforeEach(() => {
    return MockBuilder(WidgetEditInfoComponent).mock([ReactiveFormsModule]);
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
