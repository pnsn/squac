import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DateService } from "../projects/squac-ui/src/app/core/services/date.service";
import { SharedModule } from "../projects/squac-ui/src/app/shared/shared.module";
import { MockBuilder } from "ng-mocks";

import { DateSelectComponent } from "./date-select.component";

describe("DateSelectComponent", () => {
  let component: DateSelectComponent;
  let fixture: ComponentFixture<DateSelectComponent>;

  beforeEach(() => {
    return MockBuilder(DateSelectComponent)
      .mock(SharedModule)
      .mock(DateService);
  });

  it("should create", () => {
    fixture = TestBed.createComponent(DateSelectComponent);
    component = fixture.componentInstance;
    component.ranges = [];
    component.timeRanges = [];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
