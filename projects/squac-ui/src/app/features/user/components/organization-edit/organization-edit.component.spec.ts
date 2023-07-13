import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  MatDialogRef,
  MAT_DIALOG_DATA as MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MockBuilder } from "ng-mocks";
import { OrganizationEditComponent } from "./organization-edit.component";

describe("OrganizationEditComponent", () => {
  let component: OrganizationEditComponent;
  let fixture: ComponentFixture<OrganizationEditComponent>;

  beforeEach(() => {
    return MockBuilder(OrganizationEditComponent, [
      MatDialogRef,
      MAT_DIALOG_DATA,
    ])
      .mock(MatDialogRef)
      .mock(MAT_DIALOG_DATA, {
        data: {},
      });
  });

  it("should create", () => {
    fixture = TestBed.createComponent(OrganizationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
