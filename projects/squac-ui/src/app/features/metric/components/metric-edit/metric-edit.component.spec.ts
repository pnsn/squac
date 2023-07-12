import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MetricEditComponent } from "./metric-edit.component";
import { ReactiveFormsModule } from "@angular/forms";
import {
  MatDialogRef,
  MAT_DIALOG_DATA as MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MockBuilder } from "ng-mocks";
import { MetricModule } from "@metric/metric.module";

describe("MetricEditComponent", () => {
  let component: MetricEditComponent;
  let fixture: ComponentFixture<MetricEditComponent>;

  beforeEach(() => {
    return MockBuilder(MetricEditComponent, [
      MetricModule,
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
