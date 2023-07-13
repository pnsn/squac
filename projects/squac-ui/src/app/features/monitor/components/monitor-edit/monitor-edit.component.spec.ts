import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import {
  MatDialogRef,
  MAT_DIALOG_DATA as MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "@user/services/user.service";
import { of } from "rxjs";

import { MonitorEditComponent } from "./monitor-edit.component";
import { MockBuilder } from "ng-mocks";
import { RouterTestingModule } from "@angular/router/testing";

describe("MonitorEditComponent", () => {
  let component: MonitorEditComponent;
  let fixture: ComponentFixture<MonitorEditComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy("close"),
  };

  beforeEach(() => {
    return MockBuilder(MonitorEditComponent)
      .mock(RouterTestingModule.withRoutes([]))
      .mock(UserService)
      .keep(FormBuilder)
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

  it("should create", () => {
    fixture = TestBed.createComponent(MonitorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
