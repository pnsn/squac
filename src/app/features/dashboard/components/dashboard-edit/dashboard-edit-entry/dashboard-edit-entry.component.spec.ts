import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { RouterTestingModule } from "@angular/router/testing";
import { DashboardService } from "@features/dashboard/services/dashboard.service";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";

import { DashboardEditEntryComponent } from "./dashboard-edit-entry.component";

describe("DashboardEditEntryComponent", () => {
  let component: DashboardEditEntryComponent;
  let fixture: ComponentFixture<DashboardEditEntryComponent>;

  beforeEach(() =>
    MockBuilder(DashboardEditEntryComponent)
      .keep(RouterTestingModule)
      .mock(DashboardService)
      .mock(MatDialogModule)
      .provide({
        provide: MatDialog,
        useValue: {
          open: (_ref, _options) => {
            return {
              close: (_value) => {
                return;
              },
              afterClosed: () => {
                return of(true);
              },
            };
          },
          closeAll: () => {
            return;
          },
        },
      })
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