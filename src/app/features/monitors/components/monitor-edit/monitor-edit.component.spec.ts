import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute } from "@angular/router";
import { AbilityModule } from "@casl/angular";
import { UserService } from "@features/user/services/user.service";
import { MockUserService } from "@features/user/services/user.service.mock";
import { SharedModule } from "@shared/shared.module";
import { of } from "rxjs";
import { MonitorChartComponent } from "../monitor-chart/monitor-chart.component";

import { MonitorEditComponent } from "./monitor-edit.component";

describe("MonitorEditComponent", () => {
  let component: MonitorEditComponent;
  let fixture: ComponentFixture<MonitorEditComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy("close"),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonitorEditComponent, MonitorChartComponent],
      imports: [
        NoopAnimationsModule,
        AbilityModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        SharedModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef,
        },
        {
          provide: UserService,
          useValue: new MockUserService(),
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            data: {},
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }),
            snapshot: {
              data: {
                monitor: {},
              },
            },
          },
        },
      ],
    }).compileComponents();
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
