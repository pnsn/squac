import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatLegacyDialog as MatDialog, MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { DashboardService } from "squacapi";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";

import { OrganizationEditEntryComponent } from "./organization-edit-entry.component";
import { Observable } from "rxjs";

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
              close: (_value): any => {
                return;
              },
              afterClosed: (): Observable<any> => {
                return of(true);
              },
            };
          },
          closeAll: (): any => {
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
