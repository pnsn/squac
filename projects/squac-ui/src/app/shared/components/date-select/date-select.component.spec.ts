import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DateService } from "@core/services/date.service";
import { MockBuilder } from "ng-mocks";

import { DateSelectComponent } from "./date-select.component";

describe("DateSelectComponent", () => {
  let component: DateSelectComponent;
  let fixture: ComponentFixture<DateSelectComponent>;

  beforeEach(() => {
    return MockBuilder(DateSelectComponent).keep(DateService);
  });

  it("should create", () => {
    fixture = TestBed.createComponent(DateSelectComponent);
    component = fixture.componentInstance;
    component.timeRanges = [];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
