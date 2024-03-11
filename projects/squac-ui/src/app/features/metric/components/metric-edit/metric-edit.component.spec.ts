import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MetricEditComponent } from "./metric-edit.component";
import {
  MatDialogRef,
  MAT_DIALOG_DATA as MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MockBuilder } from "ng-mocks";

describe("MetricEditComponent", () => {
  let component: MetricEditComponent;
  let fixture: ComponentFixture<MetricEditComponent>;

  beforeEach(() => {
    return MockBuilder(MetricEditComponent, [
      MatDialogRef,
      MAT_DIALOG_DATA,
    ]).mock(MAT_DIALOG_DATA, {
      data: {},
    });
  });

  it("should create", () => {
    fixture = TestBed.createComponent(MetricEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
