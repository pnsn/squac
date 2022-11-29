import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardEditComponent } from "./dashboard-edit.component";
import { DashboardService } from "squacapi";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "@shared/material.module";
import { UserService } from "@user/services/user.service";
import { MockBuilder } from "ng-mocks";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ChannelGroupSelectorComponent } from "@shared/components/channel-group-selector/channel-group-selector.component";

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
