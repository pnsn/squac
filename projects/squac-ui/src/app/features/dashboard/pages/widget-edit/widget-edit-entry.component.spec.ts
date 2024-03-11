import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WidgetEditEntryComponent } from "./widget-edit-entry.component";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { MockBuilder } from "ng-mocks";
import { WidgetEditComponent } from "../../components/widget-edit/widget-edit.component";
import { WidgetService } from "squacapi";
import { MatDialogModule } from "@angular/material/dialog";

describe("WidgetEditEntryComponent", () => {
  let component: WidgetEditEntryComponent;
  let fixture: ComponentFixture<WidgetEditEntryComponent>;

  beforeEach(() => {
    return MockBuilder(WidgetEditComponent)
      .mock(WidgetService)
      .mock(MatDialogModule)
      .keep(RouterTestingModule.withRoutes([]))
      .provide({
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: 1 }),
        },
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetEditEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
