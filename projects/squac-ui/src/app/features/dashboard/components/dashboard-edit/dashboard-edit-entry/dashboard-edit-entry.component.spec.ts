import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { DashboardService } from "squacapi";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";

import { DashboardEditEntryComponent } from "./dashboard-edit-entry.component";

describe("DashboardEditEntryComponent", () => {
  let component: DashboardEditEntryComponent;
  let fixture: ComponentFixture<DashboardEditEntryComponent>;

  beforeEach(() =>
    MockBuilder(DashboardEditEntryComponent)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(DashboardService)
      .keep(ActivatedRoute)
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

  it("should create", () => {
    fixture = TestBed.createComponent(DashboardEditEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
