import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute } from "@angular/router";
import { AbilityModule } from "@casl/angular";
import { UserService } from "@user/services/user.service";
import { SharedModule } from "@shared/shared.module";
import { of } from "rxjs";
import { MonitorChartComponent } from "../monitor-chart/monitor-chart.component";

import { MonitorEditComponent } from "./monitor-edit.component";
import { MockBuilder } from "ng-mocks";
import { MonitorModule } from "@features/monitor/monitor.module";

describe("MonitorEditComponent", () => {
  let component: MonitorEditComponent;
  let fixture: ComponentFixture<MonitorEditComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy("close"),
  };

  beforeEach(() => {
    return MockBuilder(MonitorEditComponent, MonitorModule)
      .mock(ReactiveFormsModule)
      .mock(UserService)
      .provide({
        provide: MatDialogRef,
        useValue: mockDialogRef,
      })
      .provide({
        provide: MAT_DIALOG_DATA,
        useValue: {
          data: {},
        },
      })
      .provide({
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: 1 }),
          snapshot: {
            data: {
              monitor: {},
            },
          },
        },
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
