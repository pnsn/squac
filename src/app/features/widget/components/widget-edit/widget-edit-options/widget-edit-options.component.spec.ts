import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WidgetEditOptionsComponent } from "./widget-edit-options.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { WidgetEditService } from "@features/widget/services/widget-config.service";
import { MockBuilder } from "ng-mocks";
import { BehaviorSubject } from "rxjs";

describe("WidgetEditOptionsComponent", () => {
  let component: WidgetEditOptionsComponent;
  let fixture: ComponentFixture<WidgetEditOptionsComponent>;

  beforeEach(() => {
    return MockBuilder(WidgetEditOptionsComponent)
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
    fixture = TestBed.createComponent(WidgetEditOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
