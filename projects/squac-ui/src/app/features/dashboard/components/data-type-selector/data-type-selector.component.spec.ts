import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockBuilder } from "ng-mocks";

import { DataTypeSelectorComponent } from "./data-type-selector.component";
import { DataTypePipe } from "./data-type.pipe";

describe("DataTypeSelectorComponent", () => {
  let component: DataTypeSelectorComponent;
  let fixture: ComponentFixture<DataTypeSelectorComponent>;

  beforeEach(() => {
    return MockBuilder(DataTypeSelectorComponent).mock(DataTypePipe);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTypeSelectorComponent);
    component = fixture.componentInstance;
    component.dataType = "raw";
    component.statType = null;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
