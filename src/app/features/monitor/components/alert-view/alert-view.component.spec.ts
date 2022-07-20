import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { AbilityModule } from "@casl/angular";
import { DateService } from "@core/services/date.service";
import { MonitorModule } from "@features/monitor/monitor.module";
import { TableViewComponent } from "@shared/components/table-view/table-view.component";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";

import { AlertViewComponent } from "./alert-view.component";

describe("AlertViewComponent", () => {
  let component: AlertViewComponent;
  let fixture: ComponentFixture<AlertViewComponent>;

  beforeEach(() => {
    return MockBuilder(AlertViewComponent, MonitorModule)
      .mock(TableViewComponent)
      .mock(AbilityModule)
      .mock(HttpClientTestingModule)
      .mock(RouterTestingModule.withRoutes([]))
      .mock(DateService)
      .provide({
        provide: ActivatedRoute,
        useValue: {
          data: of(),
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
