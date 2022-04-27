import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WidgetEditThresholdsComponent } from "./widget-edit-thresholds.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { WidgetEditService } from "@widget/services/widget-edit.service";
import { MockBuilder } from "ng-mocks";
import { BehaviorSubject } from "rxjs";

describe("WidgetEditThresholdsComponent", () => {
  let component: WidgetEditThresholdsComponent;
  let fixture: ComponentFixture<WidgetEditThresholdsComponent>;

  beforeEach(() => {
    return MockBuilder(WidgetEditThresholdsComponent)
      .mock(NgxDatatableModule)
      .provide({
        provide: WidgetEditService,
        useValue: {
          selectedMetrics: new BehaviorSubject(null),
          getThresholds: () => {
            return;
          },
        },
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetEditThresholdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
