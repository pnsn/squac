import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WidgetEditOptionsComponent } from "./widget-edit-options.component";
import { WidgetConfigService } from "@features/widget/services/widget-config.service";
import { MockBuilder } from "ng-mocks";
import { BehaviorSubject } from "rxjs";
import { WidgetModule } from "@features/widget/widget.module";
import { ReactiveFormsModule } from "@angular/forms";

describe("WidgetEditOptionsComponent", () => {
  let component: WidgetEditOptionsComponent;
  let fixture: ComponentFixture<WidgetEditOptionsComponent>;

  beforeEach(() => {
    return MockBuilder(WidgetEditOptionsComponent, WidgetModule)
      .keep(ReactiveFormsModule)
      .provide({
        provide: WidgetConfigService,
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
