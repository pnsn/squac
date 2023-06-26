import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardEditComponent } from "./dashboard-edit.component";
import { DashboardService } from "squacapi";
import { ReactiveFormsModule } from "@angular/forms";
import { UserService } from "@user/services/user.service";
import { MockBuilder } from "ng-mocks";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA as MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ChannelGroupSelectorComponent } from "@shared/components/channel-group-selector/channel-group-selector.component";
import { SharingToggleComponent } from "@shared/components/sharing-toggle/sharing-toggle.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

describe("DashboardEditComponent", () => {
  let component: DashboardEditComponent;
  let fixture: ComponentFixture<DashboardEditComponent>;

  beforeEach(() => {
    return MockBuilder(
      [DashboardEditComponent, MatDialogRef],
      [
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        SharingToggleComponent,
        DashboardService,
        UserService,
        ChannelGroupSelectorComponent,
        MAT_DIALOG_DATA,
      ]
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
