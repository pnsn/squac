import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatLegacyDialog as MatDialog, MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { RouterTestingModule } from "@angular/router/testing";
import { MetricService } from "squacapi";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";

import { MetricEditEntryComponent } from "./metric-edit-entry.component";

describe("MetricEditEntryComponent", () => {
  let component: MetricEditEntryComponent;
  let fixture: ComponentFixture<MetricEditEntryComponent>;

  beforeEach(() =>
    MockBuilder(MetricEditEntryComponent)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(MetricService)
      .mock(MatDialogModule)
      .provide({
        provide: MatDialog,
        useValue: {
          open: (_ref, _options) => {
            return {
              close: (_value): any => {
                return;
              },
              afterClosed: (): any => {
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

  it("should create", () => {
    fixture = TestBed.createComponent(MetricEditEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
