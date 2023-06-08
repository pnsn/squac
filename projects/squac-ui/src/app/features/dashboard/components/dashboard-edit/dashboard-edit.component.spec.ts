import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardEditComponent } from "./dashboard-edit.component";
import { DashboardService } from "squacapi";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "@shared/material.module";
import { UserService } from "@user/services/user.service";
import { MockBuilder } from "ng-mocks";
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from "@angular/material/legacy-dialog";
import { ChannelGroupSelectorComponent } from "@shared/components/channel-group-selector/channel-group-selector.component";
import { SharingToggleComponent } from "@shared/components/sharing-toggle/sharing-toggle.component";

describe("DashboardEditComponent", () => {
  let component: DashboardEditComponent;
  let fixture: ComponentFixture<DashboardEditComponent>;

  beforeEach(() => {
    return MockBuilder(DashboardEditComponent)
      .mock(MaterialModule)
      .mock(MatDialogRef)
      .mock(MAT_DIALOG_DATA, {
        data: {},
      })
      .mock(SharingToggleComponent)
      .keep(ReactiveFormsModule)
      .keep(FormsModule)
      .mock(DashboardService)
      .mock(UserService)
      .mock(ChannelGroupSelectorComponent);
  });

  it("should create", () => {
    fixture = TestBed.createComponent(DashboardEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
