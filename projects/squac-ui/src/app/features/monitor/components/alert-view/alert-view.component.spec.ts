import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { DateService } from "../projects/squac-ui/src/app/core/services/date.service";
import { MonitorModule } from "../projects/squac-ui/src/app/features/monitor/monitor.module";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";

import { AlertViewComponent } from "./alert-view.component";

describe("AlertViewComponent", () => {
  let component: AlertViewComponent;
  let fixture: ComponentFixture<AlertViewComponent>;

  beforeEach(() => {
    return MockBuilder(AlertViewComponent)
      .mock(MonitorModule)
      .mock(RouterTestingModule.withRoutes([]))
      .mock(DateService)
      .provide({
        provide: ActivatedRoute,
        useValue: {
          params: of(),
          snapshot: {},
        },
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
