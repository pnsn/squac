import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ThresholdEditComponent } from "./threshold-edit.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { WidgetEditService } from "../../../services/widget-edit.service";
import { MockBuilder } from "ng-mocks";
import { BehaviorSubject } from "rxjs";

describe("ThresholdEditComponent", () => {
  let component: ThresholdEditComponent;
  let fixture: ComponentFixture<ThresholdEditComponent>;

  beforeEach(() => {
    return MockBuilder(ThresholdEditComponent)
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
    fixture = TestBed.createComponent(ThresholdEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
