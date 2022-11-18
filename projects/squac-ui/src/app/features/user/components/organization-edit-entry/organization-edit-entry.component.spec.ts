import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { DashboardService } from "@squacapi/services/dashboard.service";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";

import { OrganizationEditEntryComponent } from "./organization-edit-entry.component";

describe("OrganizationEditEntryComponent", () => {
  let component: OrganizationEditEntryComponent;
  let fixture: ComponentFixture<OrganizationEditEntryComponent>;

  beforeEach(() =>
    MockBuilder(OrganizationEditEntryComponent)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(DashboardService)
      .mock(MatDialogModule)
      .keep(ActivatedRoute)
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
    fixture = TestBed.createComponent(OrganizationEditEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
