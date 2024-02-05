import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { DateService } from "@core/services/date.service";
import { AlertService } from "squacapi";
import { MonitorService } from "squacapi";
import { TableViewComponent } from "@shared/components/table-view/table-view.component";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";

import { MonitorViewComponent } from "./monitor-view.component";
import { DetailPageComponent } from "@shared/components/detail-page/detail-page.component";

describe("MonitorViewComponent", () => {
  let component: MonitorViewComponent;
  let fixture: ComponentFixture<MonitorViewComponent>;

  beforeEach(() => {
    return MockBuilder(MonitorViewComponent)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(TableViewComponent)
      .mock(AlertService)
      .mock(DetailPageComponent)
      .mock(DateService)
      .mock(ConfirmDialogService)
      .mock(MonitorService)
      .provide({
        provide: ActivatedRoute,
        useValue: {
          params: of(),
          data: of(),
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
