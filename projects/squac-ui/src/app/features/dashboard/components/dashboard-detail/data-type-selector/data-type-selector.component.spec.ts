import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MaterialModule } from "../projects/squac-ui/src/app/shared/material.module";
import { ArchiveTypes } from "@squacapi/interfaces/archive-type-option.interface";
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
    component.dataType = ArchiveTypes.RAW;
    component.statType = null;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
