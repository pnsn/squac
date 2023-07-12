import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WidgetEditComponent } from "./widget-edit.component";
import {
  MatDialogRef,
  MAT_DIALOG_DATA as MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MockBuilder } from "ng-mocks";
import { DashboardModule } from "@dashboard/dashboard.module";

describe("WidgetEditComponent", () => {
  let component: WidgetEditComponent;
  let fixture: ComponentFixture<WidgetEditComponent>;
  beforeEach(() => {
    return MockBuilder(WidgetEditComponent, [
      DashboardModule,
      MatDialogRef,
      MAT_DIALOG_DATA,
    ]).provide({
      provide: MAT_DIALOG_DATA,
      useValue: {
        channelGroups: [],
        metrics: [],
      },
    });
  });

  beforeEach(() => {
    // dialog = d;

    fixture = TestBed.createComponent(WidgetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
