import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { DateService } from "@core/services/date.service";
import { AlertService } from "@features/monitor/services/alert.service";
import { MonitorService } from "@features/monitor/services/monitor.service";
import { TableViewComponent } from "@shared/components/table-view/table-view.component";
import { MaterialModule } from "@shared/material.module";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";

import { MonitorViewComponent } from "./monitor-view.component";

describe("MonitorViewComponent", () => {
  let component: MonitorViewComponent;
  let fixture: ComponentFixture<MonitorViewComponent>;

  beforeEach(() => {
    return MockBuilder(MonitorViewComponent)
      .mock(RouterTestingModule.withRoutes([]))
      .mock(TableViewComponent)
      .mock(MaterialModule)
      .mock(AlertService)
      .mock(DateService)
      .mock(ConfirmDialogService)
      .mock(MonitorService)
      .provide({
        provide: ActivatedRoute,
        useValue: {
          params: of(),
        },
      });
  });

  it("should create", () => {
    fixture = TestBed.createComponent(MonitorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
