import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockBuilder } from "ng-mocks";

import { MonitorComponent } from "./monitor.component";

describe("MonitorComponent", () => {
  let component: MonitorComponent;
  let fixture: ComponentFixture<MonitorComponent>;

  beforeEach(() => {
    return MockBuilder(MonitorComponent);
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorComponent);
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
