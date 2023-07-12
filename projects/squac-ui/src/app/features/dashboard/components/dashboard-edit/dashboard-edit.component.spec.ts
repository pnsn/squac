import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardEditComponent } from "./dashboard-edit.component";
import { MockBuilder } from "ng-mocks";
import {
  MatDialogRef,
  MAT_DIALOG_DATA as MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DashboardModule } from "@dashboard/dashboard.module";

describe("DashboardEditComponent", () => {
  let component: DashboardEditComponent;
  let fixture: ComponentFixture<DashboardEditComponent>;

  beforeEach(() => {
    return MockBuilder(
      [DashboardEditComponent, MatDialogRef],
      [DashboardModule, MAT_DIALOG_DATA]
    )
      .mock(MatDialogRef, {})
      .mock(MAT_DIALOG_DATA, {
        data: {},
      });
  });

  it("should create", () => {
    fixture = TestBed.createComponent(DashboardEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
