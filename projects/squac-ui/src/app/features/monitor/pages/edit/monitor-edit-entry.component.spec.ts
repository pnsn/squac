import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBuilder } from "ng-mocks";
import { MonitorEditComponent } from "../../components/monitor-edit/monitor-edit.component";

import { MonitorEditEntryComponent } from "./monitor-edit-entry.component";

describe("MonitorEditEntryComponent", () => {
  let component: MonitorEditEntryComponent;
  let fixture: ComponentFixture<MonitorEditEntryComponent>;

  beforeEach(() => {
    return MockBuilder(MonitorEditComponent)
      .mock(MonitorEditComponent)
      .keep(ActivatedRoute)
      .keep(RouterTestingModule.withRoutes([]));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorEditEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  afterEach(() => {
    fixture.destroy();
  });
});
