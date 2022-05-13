import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { WidgetEditEntryComponent } from "./widget-edit-entry.component";
import { ViewService } from "@core/services/view.service";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { MatDialogModule } from "@angular/material/dialog";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Mock, MockBuilder } from "ng-mocks";
import { WidgetEditComponent } from "../widget-edit.component";
import { WidgetEditInfoComponent } from "../widget-edit-info/widget-edit-info.component";
import { WidgetEditMetricsComponent } from "../widget-edit-metrics/widget-edit-metrics.component";
import { WidgetEditThresholdsComponent } from "../widget-edit-thresholds/widget-edit-thresholds.component";
import { WidgetEditChannelGroupComponent } from "../widget-edit-channel-group/widget-edit-channel-group.component";
import { WidgetService } from "@features/widget/services/widget.service";
import { SharedModule } from "@shared/shared.module";
import { WidgetModule } from "@features/widget/widget.module";

describe("WidgetEditEntryComponent", () => {
  let component: WidgetEditEntryComponent;
  let fixture: ComponentFixture<WidgetEditEntryComponent>;

  beforeEach(() => {
    return MockBuilder(WidgetEditComponent)
      .mock(WidgetService)
      .mock(WidgetModule)
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
