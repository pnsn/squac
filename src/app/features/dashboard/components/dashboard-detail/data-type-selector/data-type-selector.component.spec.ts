import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MaterialModule } from "@shared/material.module";
import { MockBuilder } from "ng-mocks";

import { DataTypeSelectorComponent } from "./data-type-selector.component";

describe("DataTypeSelectorComponent", () => {
  let component: DataTypeSelectorComponent;
  let fixture: ComponentFixture<DataTypeSelectorComponent>;

  beforeEach(() => {
    return MockBuilder(DataTypeSelectorComponent).mock(MaterialModule);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTypeSelectorComponent);
    component = fixture.componentInstance;
    component.dataType = "raw";
    component.statType = "";
    component.fullType = { value: "raw", short: "raw", full: "raw data" };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
