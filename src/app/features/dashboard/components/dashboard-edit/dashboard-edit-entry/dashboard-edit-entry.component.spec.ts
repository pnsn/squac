import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { RouterTestingModule } from "@angular/router/testing";
import { DashboardService } from "@features/dashboard/services/dashboard.service";
import { MockBuilder } from "ng-mocks";

import { DashboardEditEntryComponent } from "./dashboard-edit-entry.component";

describe("DashboardEditEntryComponent", () => {
  let component: DashboardEditEntryComponent;
  let fixture: ComponentFixture<DashboardEditEntryComponent>;

  beforeEach(() =>
    MockBuilder(DashboardEditEntryComponent)
      .keep(RouterTestingModule)
      .mock(DashboardService)
      .mock(MatDialogModule)
      .mock(MatDialog)
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardEditEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
