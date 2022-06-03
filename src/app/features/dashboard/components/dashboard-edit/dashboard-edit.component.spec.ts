import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardEditComponent } from "./dashboard-edit.component";
import { DashboardService } from "../../services/dashboard.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "@shared/material.module";
import { UserService } from "@user/services/user.service";
import { MockBuilder } from "ng-mocks";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";

describe("DashboardEditComponent", () => {
  let component: DashboardEditComponent;
  let fixture: ComponentFixture<DashboardEditComponent>;

  beforeEach(() => {
    return MockBuilder(DashboardEditComponent)
      .keep(ActivatedRoute)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(MaterialModule)
      .mock(MatDialogRef)
      .mock(MAT_DIALOG_DATA, {
        data: {},
      })
      .keep(ReactiveFormsModule)
      .keep(FormsModule)
      .mock(DashboardService)
      .mock(UserService);
  });

  it("should create", () => {
    fixture = TestBed.createComponent(DashboardEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
